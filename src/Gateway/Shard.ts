import {EventEmitter} from "eventemitter3";
import WebSocket from "uws";
import {GATEWAY_VERSION, GatewayOPCodes as OPCodes} from "../Config/Constants";
import Bucket from "../Helper/Bucket";
import Kernel from "../Kernel";
import Guild from "../Model/Guild";
import {Status} from "../Model/User";
import AbstractEvent from "./Event/AbstractEvent";
import Timer = NodeJS.Timer;

const Erlpack: any = require("erlpack");

export default class Shard extends EventEmitter {
    public status: string;

    private heartbeatInterval: Timer | number;
    private connectAttempts: number = 0;
    private connecting: boolean     = false;
    private lastHeartbeatSent: number;
    private lastHeartbeatReceived: number;
    private ws: WebSocket;
    private sessionID: boolean | string;
    private reconnectInterval: number;
    private ready: boolean;
    private preReady: boolean;
    private unsyncedGuilds: number;
    private lastHeartbeatAck: boolean;
    private guildSyncQueueLength: number;
    private guildSyncQueue: Array<any>;
    private getAllUsersLength: number;
    private getAllUsersQueue: Array<string>;
    private getAllUsersCount: {};
    private seq: number;
    private guildCreateTimeout: Timer | number;
    private idleSince: number | null;
    private globalBucket: Bucket;
    private presenceUpdateBucket: Bucket;
    private presence: { game: string | null, status: Status };
    private _rPackets: number;
    private _rStartTime: number;
    private discordServerTrace: any;

    constructor(public id: number, private kernel: Kernel) {
        super();

        this.hardReset();
    }

    public get latency(): number {
        return this.lastHeartbeatSent && this.lastHeartbeatReceived
            ? this.lastHeartbeatReceived - this.lastHeartbeatSent
            : Infinity;
    }

    /**
     * Tells the shard to connect
     */
    public connect() {
        if (this.ws && this.ws.readyState != WebSocket.CLOSED) {
            this.kernel.emit("error", new Error("Existing connection detected"), this.id);

            return;
        }

        ++this.connectAttempts;
        this.connecting = true;

        return this.initializeWS();
    }

    /**
     * Disconnects the shard
     * @arg {Object?} [options] Shard disconnect options
     * @arg {String | Boolean} [options.reconnect] false means destroy everything, true means you want to reconnect in
     *     the future, "auto" will autoreconnect
     */
    public disconnect(options: { reconnect: boolean | string }, error?: any) {
        if (!this.ws) {
            return;
        }

        options = options || {reconnect: true};
        if (this.heartbeatInterval) {
            clearInterval(<number> this.heartbeatInterval);
            this.heartbeatInterval = null;
        }

        this.ws.onclose = undefined;
        try {
            if (options.reconnect && this.sessionID) {
                this.ws.terminate();
            } else {
                this.ws.close();
            }
        } catch (err) {
            /**
             * Fired when the shard encounters an error
             * @event Client#error
             * @prop {Error} err The error
             * @prop {Number} identifier The ID of the shard
             */
            this.kernel.emit("error", err, this.id);
        }
        /**
         * Fired when the shard disconnects
         * @event Shard#disconnect
         * @prop {Error?} err The error, if any
         */
        this.emit("disconnect", error || null);
        this.ws = null;

        this.reset();
        if (options.reconnect === "auto" && this.kernel.configuration.autoReconnect) {
            /**
             * Fired when stuff happens and gives more info
             * @event Client#debug
             * @prop {String} message The debug message
             * @prop {Number} identifier The ID of the shard
             */
            this.kernel.emit(
                "debug",
                `Queueing reconnect in ${this.reconnectInterval}ms | Attempt ${this.connectAttempts}`,
                this.id,
            );
            setTimeout(() => {
                this.kernel.shardHandler.connect(this);
            }, this.reconnectInterval);
            this.reconnectInterval = Math.min(Math.round(this.reconnectInterval * (Math.random() * 2 + 1)), 30000);
        } else if (!options.reconnect) {
            this.hardReset();
        }
    }

    private reset() {
        this.connecting            = false;
        this.ready                 = false;
        this.preReady              = false;
        this.getAllUsersCount      = {};
        this.getAllUsersQueue      = [];
        this.getAllUsersLength     = 1;
        this.guildSyncQueue        = [];
        this.guildSyncQueueLength  = 1;
        this.unsyncedGuilds        = 0;
        this.lastHeartbeatAck      = true;
        this.lastHeartbeatReceived = null;
        this.lastHeartbeatSent     = null;
        this.status                = "disconnected";
    }

    private hardReset() {
        this.reset();
        this.seq                  = 0;
        this.sessionID            = null;
        this.reconnectInterval    = 1000;
        this.connectAttempts      = 0;
        this.ws                   = null;
        this.heartbeatInterval    = null;
        this.guildCreateTimeout   = null;
        this.idleSince            = null;
        this.globalBucket         = new Bucket(120, 60000);
        this.presenceUpdateBucket = new Bucket(5, 60000);
        this.presence             = JSON.parse(JSON.stringify(this.kernel.presence)); // Fast copy
    }

    private async wsEvent(packet: { op: number, d: any, s: number, t: string }) {
        const cls: any                = await import("./Event/" + this.getClassFromType(packet.t));
        const instance: AbstractEvent = new cls(this.kernel, this);

        return await instance.handle(packet);
    }

    private getClassFromType(type: string): string {
        return type.split("_").map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join("") + "Event";
    }

    private resume() {
        this.sendWS(OPCodes.RESUME, {
            token:      this.kernel.token,
            session_id: this.sessionID,
            seq:        this.seq,
        });
    }

    private identify() {
        var identify: any = {
            token:           this.kernel.token,
            v:               GATEWAY_VERSION,
            compress:        true,
            large_threshold: 250,
            properties:      {
                "os":      process.platform,
                "browser": "Eris",
                "device":  "Eris",
            },
        };
        if (this.kernel.configuration.maxShards > 1) {
            identify.shard = [this.id, this.kernel.configuration.maxShards];
        }
        if (this.presence.status) {
            identify.presence = this.presence;
        }

        this.sendWS(OPCodes.IDENTIFY, identify);
    }

    private syncGuild(guildID) {
        if (this.guildSyncQueueLength + 3 + guildID.length > 4081) { // 4096 - "{\"op\":12,\"d\":[]}".length + 1 for lazy comma offset
            this.requestGuildSync(this.guildSyncQueue);
            this.guildSyncQueue       = [guildID];
            this.guildSyncQueueLength = 1 + guildID.length + 3;
        } else if (this.ready) {
            this.requestGuildSync([guildID]);
        } else {
            this.guildSyncQueue.push(guildID);
            this.guildSyncQueueLength += guildID.length + 3;
        }
    }

    private requestGuildSync(guildID) {
        this.sendWS(OPCodes.SYNC_GUILD, guildID);
    }

    private async createGuild(_guild): Promise<Guild> {
        this.kernel.guildShardMap[_guild.id] = this.id;

        let guild = await this.kernel.guilds.add(_guild);
        if (this.kernel.configuration.getAllUsers && await guild.members.count() < guild.memberCount) {
            //guild.fetchAllMembers();
            // @todo Fetch all members
        }

        return guild;
    }

    private restartGuildCreateTimeout() {
        if (this.guildCreateTimeout) {
            clearTimeout(<number> this.guildCreateTimeout);
            this.guildCreateTimeout = null;
        }
        if (!this.ready) {
            if (this.kernel.unavailableGuilds.size === 0 && this.unsyncedGuilds === 0) {
                return this.checkReady();
            }
            this.guildCreateTimeout = setTimeout(() => {
                this.checkReady();
            }, this.kernel.configuration.guildCreateTimeout);
        }
    }

    private getGuildMembers(guildID, chunkCount) {
        this.getAllUsersCount[guildID] = chunkCount;
        if (this.getAllUsersLength + 3 + guildID.length > 4048) { // 4096 - "{\"op\":8,\"d\":{\"guild_id\":[],\"query\":\"\",\"limit\":0}}".length + 1 for lazy comma offset
            this.requestGuildMembers(this.getAllUsersQueue);
            this.getAllUsersQueue  = [guildID];
            this.getAllUsersLength = 1 + guildID.length + 3;
        } else if (this.ready) {
            this.requestGuildMembers([guildID]);
        } else {
            this.getAllUsersQueue.push(guildID);
            this.getAllUsersLength += guildID.length + 3;
        }
    }

    private requestGuildMembers(guildID: string | string[], query: string = "", limit: number = 0) {
        this.sendWS(OPCodes.GET_GUILD_MEMBERS, {
            guild_id: guildID,
            query:    query,
            limit:    limit,
        });
    }

    private checkReady() {
        if (!this.ready) {
            if (this.guildSyncQueue.length > 0) {
                this.requestGuildSync(this.guildSyncQueue);
                this.guildSyncQueue       = [];
                this.guildSyncQueueLength = 1;
                return;
            }
            if (this.unsyncedGuilds > 0) {
                return;
            }
            if (this.getAllUsersQueue.length > 0) {
                this.requestGuildMembers(this.getAllUsersQueue);
                this.getAllUsersQueue  = [];
                this.getAllUsersLength = 1;
                return;
            }
            if (Object.keys(this.getAllUsersCount).length === 0) {
                this.ready = true;
                /**
                 * Fired when the shard turns ready
                 * @event Shard#ready
                 */
                this.emit("ready");
            }
        }
    }

    initializeWS() {
        this._rPackets    = 0;
        this._rStartTime  = Date.now();
        this.status       = "connecting";
        this.ws           = new WebSocket(this.kernel.gatewayURL);
        this.ws.onopen    = () => {
            if (!this.kernel.token) {
                return this.disconnect(null, new Error("Token not specified"));
            }
            this.status = "handshaking";
            /**
             * Fired when the shard establishes a connection
             * @event Client#connect
             * @prop {Number} identifier The ID of the shard
             */
            this.kernel.emit("connect", this.id);
            this.lastHeartbeatAck = true;
        };
        this.ws.onmessage = (m) => {
            this._rPackets++;
            try {
                var packet = this.parse(m);

                if (this.kernel.listeners("rawWS").length > 0) {
                    /**
                     * Fired when the shard receives a websocket packet
                     * @event Client#rawWS
                     * @prop {Object} packet The packet
                     * @prop {Number} identifier The ID of the shard
                     */
                    this.kernel.emit("rawWS", packet, this.id);
                }

                if (packet.s) {
                    if (packet.s > this.seq + 1 && this.ws) {
                        /**
                         * Fired to warn of something weird but non-breaking happening
                         * @event Client#warn
                         * @prop {String} message The warning message
                         * @prop {Number} identifier The ID of the shard
                         */
                        this.kernel.emit("warn", "Non-consecutive sequence, requesting resume", this.id);
                        this.seq = packet.s;
                        this.resume();
                    }
                    this.seq = packet.s;
                }

                switch (packet.op) {
                    case OPCodes.EVENT: {
                        if (!this.kernel.configuration.disableEvents[packet.t]) {
                            this.wsEvent(packet);
                        }
                        break;
                    }
                    case OPCodes.HEARTBEAT: {
                        this.heartbeat();
                        break;
                    }
                    case OPCodes.INVALID_SESSION: {
                        this.seq       = 0;
                        this.sessionID = null;
                        this.kernel.emit("warn", "Invalid session, reidentifying!", this.id);
                        this.identify();
                        break;
                    }
                    case OPCodes.RECONNECT: {
                        this.disconnect({
                                            reconnect: "auto",
                                        });
                        break;
                    }
                    case OPCodes.HELLO: {
                        if (packet.d.heartbeat_interval > 0) {
                            if (this.heartbeatInterval) {
                                clearInterval(<number> this.heartbeatInterval);
                            }
                            this.heartbeatInterval =
                                setInterval(() => this.heartbeat(true), packet.d.heartbeat_interval);
                        }

                        this.discordServerTrace = packet.d._trace;
                        this.connecting         = false;

                        if (this.sessionID) {
                            this.resume();
                        } else {
                            this.identify();
                        }
                        this.heartbeat();
                        break;
                        /* eslint-enable no-unreachable */
                    }
                    case OPCodes.HEARTBEAT_ACK: {
                        this.lastHeartbeatAck      = true;
                        this.lastHeartbeatReceived = new Date().getTime();
                        break;
                    }
                    default: {
                        this.kernel.emit("unknown", packet, this.id);
                        break;
                    }
                }
            } catch (err) {
                this.kernel.emit("error", err, this.id);
            }
        };
        this.ws.onerror   = (event) => {
            this.kernel.emit("error", event, this.id);
        };
        this.ws.onclose   = (event) => {
            var err                         = !event.code || event.code === 1000 ? null : new Error(event.code +
                                                                                                    ": " +
                                                                                                    event.reason);
            var reconnect: string | boolean = "auto";
            if (event.code) {
                this.kernel.emit(
                    "warn",
                    `${event.code ===
                       1000
                        ? "Clean"
                        : "Unclean"} WS close: ${event.code}: ${event.reason}`,
                    this.id,
                );
                if (event.code === 4001) {
                    err = new Error("Gateway received invalid OP code");
                } else if (event.code === 4002) {
                    err = new Error("Gateway received invalid message");
                } else if (event.code === 4003) {
                    err = new Error("Not authenticated");
                } else if (event.code === 4004) {
                    err       = new Error("Authentication failed");
                    reconnect = false;
                } else if (event.code === 4005) {
                    err = new Error("Already authenticated");
                } else if (event.code === 4006 || event.code === 4009) {
                    err            = new Error("Invalid session");
                    this.sessionID = null;
                } else if (event.code === 4007) {
                    err      = new Error("Invalid sequence number: " + this.seq);
                    this.seq = 0;
                } else if (event.code === 4008) {
                    err = new Error("Gateway connection was ratelimited");
                } else if (event.code === 4010) {
                    err       = new Error("Invalid shard key");
                    reconnect = false;
                } else if (event.code === 4011) {
                    err       = new Error("Shard has too many guilds (>2500)");
                    reconnect = false;
                } else if (event.code === 1006) {
                    err = new Error("Connection reset by peer");
                } else if (!event.wasClean && event.reason) {
                    err = new Error(event.code + ": " + event.reason);
                }
            } else {
                this.kernel.emit("warn", event, this.id);
            }
            this.disconnect({
                                reconnect: reconnect,
                            }, err);
        };

        setTimeout(() => {
            if (this.connecting) {
                this.disconnect({
                                    reconnect: "auto",
                                }, new Error("Connection timeout"));
            }
        }, this.kernel.configuration.connectionTimeout);
    }

    parse(message) {
        var data = message.data;
        if (data instanceof ArrayBuffer) {
            data = new Buffer(data);
        } else if (Array.isArray(data)) { // Fragmented messages
            data = Buffer.concat(data); // Copyfull concat is slow, but no alternative
        }

        return Erlpack.unpack(data);
    }

    heartbeat(normal: boolean = false) {
        if (normal && !this.lastHeartbeatAck) {
            return this.disconnect(
                {
                    reconnect: "auto",
                },
                new Error("Server didn't acknowledge previous heartbeat, possible lost connection"),
            );
        }
        this.lastHeartbeatAck  = false;
        this.lastHeartbeatSent = new Date().getTime();
        this.sendWS(OPCodes.HEARTBEAT, this.seq);
    }

    sendWS(op, _data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            var i       = 0;
            var waitFor = 1;
            var func    = () => {
                if (++i >= waitFor && this.ws && this.ws.readyState === WebSocket.OPEN) {
                    var data = Erlpack ? Erlpack.pack({op: op, d: _data}) : JSON.stringify({op: op, d: _data});
                    this.ws.send(data);
                    this.kernel.emit("debug", JSON.stringify({op: op, d: _data}), this.id);
                }
            };
            if (op === OPCodes.STATUS_UPDATE) {
                ++waitFor;
                this.presenceUpdateBucket.queue(func);
            }
            this.globalBucket.queue(func);
        }
    }

    /**
     * Updates the bot's status on all guilds the shard is in
     * @arg {String} [status] Sets the bot's status, either "online", "idle", "dnd", or "invisible"
     * @arg {Object} [game] Sets the bot's active game, null to clear
     * @arg {String} game.name Sets the name of the bot's active game
     * @arg {Number} [game.type] The type of game. 0 is default, 1 is streaming (Twitch only)
     * @arg {String} [game.url] Sets the url of the shard's active game
     */
    editStatus(status, game) {
        if (game === undefined && typeof status === "object") {
            game   = status;
            status = undefined;
        }
        if (status) {
            this.presence.status = status;
        }
        if (game !== undefined) {
            game.type          = game.url ? 1 : 0;
            this.presence.game = game;
        }

        this.sendStatusUpdate();

        // @todo Loop through guilds on the shard and set status for the member
    }

    sendStatusUpdate() {
        this.sendWS(OPCodes.STATUS_UPDATE, {
            afk:    false,
            game:   this.presence.game,
            since:  this.presence.status === "idle" ? Date.now() : 0,
            status: this.presence.status,
        });
    }
}
