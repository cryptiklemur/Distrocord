import * as HTTPS from "https";
import * as Zlib from "zlib";

import * as Endpoints from "../Config/Endpoints";
import MultipartData from "../Helper/MultipartData";
import SequentialBucket from "../Helper/SequentialBucket";
import Kernel from "../Kernel";

const version: any = require("../../package.json").version;

/**
 * Handles API requests
 */
export default class RequestHandler {
    private kernel: Kernel;
    private userAgent: string      = `DistroDiscord (https://github.com/DiscordBot/DistroDiscord, ${version})`;
    private ratelimits: any        = {};
    private latencyRef: { latency: number, raw: number[], total: number, timeOffset: number, lastTimeOffsetCheck: number };
    private globalBlock: boolean   = false;
    private readyQueue: Array<any> = [];

    constructor(kernel: Kernel, forceQueueing: boolean = false) {
        this.kernel      = kernel;
        this.latencyRef  = {
            latency:             500,
            raw:                 [500, 500, 500, 500, 500, 500, 500, 500, 500, 500],
            total:               5000,
            timeOffset:          0,
            lastTimeOffsetCheck: 0,
        };
        this.globalBlock = false;
        this.readyQueue  = [];
        if (forceQueueing) {
            this.globalBlock = true;

            this.kernel.once("shardPreReady", this.globalUnblock.bind(this));
        }
    }

    globalUnblock() {
        this.globalBlock = false;
        while (this.readyQueue.length > 0) {
            this.readyQueue.shift()();
        }
    }

    routefy(url) {
        return url.replace(/\/([a-z-]+)\/(?:[0-9]{17,})+?/g, function (match, p) {
            return p === "channels" || p === "guilds" ? match : `/${p}/:id`;
        }).replace(/\/reactions\/.+/g, "/reactions/:identifier");
    }

    /**
     * Make an API request
     *
     * @arg {String} method Uppercase HTTP method
     * @arg {String} url URL of the endpoint
     * @arg {Boolean} auth Whether to add the Authorization header and token or not
     * @arg {Object} [body] Request payload
     * @arg {Object} [file] File object
     * @arg {String} file.file A buffer containing file data
     * @arg {String} file.name What to name the file
     * @returns {Promise<Object>} Resolves with the returned JSON data
     */
    request(
        method: string,
        url: string,
        auth?: boolean,
        body?: any,
        file?: { file: string, name: string } | Array<{ file: string, name: string }>,
        _route?: string,
        short?,
    ) {
        let route: string = _route || this.routefy(url);

        return new Promise<any>((resolve, reject) => {
            let attempts: number = 0;

            let actualCall = (cb) => {
                let headers: any = {
                    "User-Agent":      this.userAgent,
                    "Accept-Encoding": "gzip,deflate",
                };
                let data;

                try {
                    if (auth) {
                        headers.Authorization = this.kernel.token;
                    }
                    if (body && body.reason) { // Audit log reason sniping
                        headers["X-Audit-Log-Reason"] = body.reason;
                        delete body.reason;
                    }
                    if (body && body.queryReason) {
                        body.reason = body.queryReason;
                        delete body.queryReason;
                    }
                    if (file) {
                        if (Array.isArray(file)) {
                            data                    = new MultipartData();
                            headers["Content-Type"] = "multipart/form-data; boundary=" + data.boundary;
                            file.forEach(function (f) {
                                if (!f.file) {
                                    return;
                                }
                                data.attach("file", f.file, f.name);
                                if (body) {
                                    data.attach("payload_json", body);
                                }
                            });
                            data = data.finish();
                        } else if (file.file) {
                            data                    = new MultipartData();
                            headers["Content-Type"] = "multipart/form-data; boundary=" + data.boundary;
                            data.attach("file", file.file, file.name);
                            if (body) {
                                data.attach("payload_json", body);
                            }
                            data = data.finish();
                        } else {
                            throw new Error("Invalid file object");
                        }
                    } else if (body) {
                        if (method === "GET" || (method === "PUT" && url.includes("/bans/"))) { // TODO remove PUT case when devs fix
                            let qs = "";
                            Object.keys(body).forEach(function (key) {
                                if (body[key] != undefined) {
                                    if (Array.isArray(body[key])) {
                                        body[key].forEach(function (val) {
                                            qs += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
                                        });
                                    } else {
                                        qs += `&${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`;
                                    }
                                }
                            });
                            url += "?" + qs.substring(1);
                        } else {
                            data                    = JSON.stringify(body);
                            headers["Content-Type"] = "application/json";
                        }
                    }
                } catch (err) {
                    cb();
                    reject(err);
                    return;
                }

                let req = HTTPS.request(
                    {
                        method:  method,
                        // host: ~url.indexOf("154461004984614912") ? "requestb.in" : "discordapp.com",
                        // path: ~url.indexOf("154461004984614912") ? "/1jje57y1" : this.baseURL + url,
                        host:    "discordapp.com",
                        path:    Endpoints.BASE_URL + url,
                        headers: headers,
                    },
                );

                let reqError;

                req.once("abort", () => {
                    cb();
                    reqError     = reqError || new Error(`Request aborted by kernel on ${method} ${url}`);
                    reqError.req = req;
                    reject(reqError);
                }).once("aborted", () => {
                    cb();
                    reqError     = reqError || new Error(`Request aborted by server on ${method} ${url}`);
                    reqError.req = req;
                    reject(reqError);
                }).once("error", (err) => {
                    reqError = err;
                    // console.log(err);
                    req.abort();
                });

                let latency = Date.now();

                req.once("response", (resp) => {
                    latency                 = Date.now() - latency;
                    this.latencyRef.total   = this.latencyRef.total - this.latencyRef.raw.shift() + latency;
                    this.latencyRef.latency = ~~(this.latencyRef.total / this.latencyRef.raw.push(latency));

                    if (this.latencyRef.lastTimeOffsetCheck < Date.now() - 60000) {
                        let timeOffset = Date.parse(resp.headers["date"]) -
                                         (this.latencyRef.lastTimeOffsetCheck = Date.now());
                        if (~~(this.latencyRef.timeOffset) -
                            this.latencyRef.latency >=
                            1000 &&
                            ~~(timeOffset) -
                            this.latencyRef.latency >=
                            1000) {
                            this.kernel.emit(
                                "error",
                                new Error(`Your clock is ${this.latencyRef.timeOffset}ms behind Discord's server clock. Please check your connection and system time.`),
                            );
                        }
                        this.latencyRef.timeOffset = timeOffset;
                    }

                    let response = "";

                    let _respStream = resp;
                    if (resp.headers["content-encoding"]) {
                        if (~resp.headers["content-encoding"].indexOf("gzip")) {
                            _respStream = resp.pipe(Zlib.createGunzip());
                        } else if (~resp.headers["content-encoding"].indexOf("deflate")) {
                            _respStream = resp.pipe(Zlib.createInflate());
                        }
                    }

                    _respStream.on("data", (str) => {
                        response += str;
                    }).once("end", () => {
                        let now = Date.now();

                        if (resp.headers["x-ratelimit-limit"]) {
                            this.ratelimits[route].limit = +resp.headers["x-ratelimit-limit"];
                        }

                        this.ratelimits[route].remaining =
                            resp.headers["x-ratelimit-remaining"] === undefined
                                ? 1
                                : +resp.headers["x-ratelimit-remaining"] || 0;

                        if (resp.headers["retry-after"]) {
                            if (resp.headers["x-ratelimit-global"]) {
                                this.globalBlock = true;
                                setTimeout(() => this.globalUnblock(), +resp.headers["retry-after"] || 1);
                            } else {
                                this.ratelimits[route].reset = (+resp.headers["retry-after"] || 1) + now;
                            }
                        } else if (resp.headers["x-ratelimit-reset"]) {
                            this.ratelimits[route].reset =
                                Math.max(
                                    +resp.headers["x-ratelimit-reset"] *
                                    (route.endsWith("/reactions/:identifier") ? 250 : 1000) + this.latencyRef.timeOffset, now);
                        } else {
                            this.ratelimits[route].reset = now;
                        }

                        if (resp.statusCode !== 429) {
                            this.kernel.emit(
                                "debug",
                                `${body &&
                                   body.content} ${now} ${route} ${resp.statusCode}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset -
                                                                                                                                                                                                                                                           now}ms left)`,
                            );
                        }

                        if (resp.statusCode >= 300) {
                            if (resp.statusCode === 429) {
                                this.kernel.emit(
                                    "warn",
                                    `${resp.headers["x-ratelimit-global"]
                                        ? "Global"
                                        : "Unexpected"} 429 (╯°□°）╯︵ ┻━┻: ${response}\n${body &&
                                                                                         body.content} ${now} ${route} ${resp.statusCode}: ${latency}ms (${this.latencyRef.latency}ms avg) | ${this.ratelimits[route].remaining}/${this.ratelimits[route].limit} left | Reset ${this.ratelimits[route].reset} (${this.ratelimits[route].reset -
                                                                                                                                                                                                                                                                                                                 now}ms left)`,
                                );
                                if (resp.headers["retry-after"]) {
                                    setTimeout(() => {
                                        cb();
                                        this.request(method, url, auth, body, file, route, true)
                                            .then(resolve)
                                            .catch(reject);
                                    }, +resp.headers["retry-after"]);
                                    return;
                                } else {
                                    cb();
                                    this.request(method, url, auth, body, file, route, true)
                                        .then(resolve)
                                        .catch(reject);
                                    return;
                                }
                            } else if (resp.statusCode === 502 && ++attempts < 4) {
                                this.kernel.emit("warn", "A wild 502 appeared! Thanks CloudFlare!");
                                setTimeout(() => {
                                    this.request(method, url, auth, body, file, route, true)
                                        .then(resolve)
                                        .catch(reject);
                                }, Math.floor(Math.random() * 1900 + 100));
                                return cb();
                            }
                            cb();
                            let err: any = new Error(`${resp.statusCode} ${resp.statusMessage} on ${method} ${url}\n\n${response.substring(
                                0,
                                200,
                            )}`);
                            err.resp     = resp;
                            err.response = response;
                            err.req      = req;
                            reject(err);
                            return;
                        }
                        if (response.length > 0) {
                            if (resp.headers["content-type"] === "application/json") {
                                try {
                                    response = JSON.parse(response);
                                } catch (err) {
                                    cb();
                                    reject(err);
                                    return;
                                }
                            }
                        }
                        cb();
                        resolve(response);
                    });
                });

                req.setTimeout(15000, function () {
                    reqError = new Error(`Request timed out (>15000ms) on ${method} ${url}`);
                    req.abort();
                });

                if (Array.isArray(data)) {
                    for (let chunk of data) {
                        req.write(chunk);
                    }
                    req.end();
                } else {
                    req.end(data);
                }
            };

            if (this.globalBlock && auth) {
                this.readyQueue.push(() => {
                    if (!this.ratelimits[route]) {
                        this.ratelimits[route] = new SequentialBucket(1, this.latencyRef);
                    }
                    this.ratelimits[route].queue(actualCall, short);
                });
            } else {
                if (!this.ratelimits[route]) {
                    this.ratelimits[route] = new SequentialBucket(1, this.latencyRef);
                }
                this.ratelimits[route].queue(actualCall, short);
            }
        });
    }
}