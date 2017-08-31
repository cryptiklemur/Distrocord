import Kernel from "../Kernel";
/**
 * Handles API requests
 */
export default class RequestHandler {
    private kernel;
    private userAgent;
    private ratelimits;
    private latencyRef;
    private globalBlock;
    private readyQueue;
    constructor(kernel: Kernel, forceQueueing?: boolean);
    globalUnblock(): void;
    routefy(url: any): any;
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
    request(method: string, url: string, auth?: boolean, body?: any, file?: {
        file: string;
        name: string;
    } | Array<{
        file: string;
        name: string;
    }>, _route?: string, short?: any): Promise<any>;
}
