/**
 * Handle ratelimiting something
 *
 * @prop {Number} tokens How many tokens the bucket has consumed in this interval
 * @prop {Number} lastReset Timestamp of last token clearing
 * @prop {Number} lastSend Timestamp of last token consumption
 * @prop {Number} tokenLimit The max number tokens the bucket can consume per interval
 * @prop {Number} interval How long (in ms) to wait between clearing used tokens
 */
export default class Bucket {
    private tokenLimit;
    private interval;
    private latencyRef;
    private lastReset;
    private tokens;
    private lastSend;
    private _queue;
    private timeout;
    /**
     * Construct a Bucket
     *
     * @arg {Number} tokenLimit The max number of tokens the bucket can consume per interval
     * @arg {Number} interval How long (in ms) to wait between clearing used tokens
     * @arg {Object} [latencyRef] An object
     * @arg {Number} latencyRef.latency Interval between consuming tokens
     */
    constructor(tokenLimit: number, interval: number, latencyRef?: {
        latency: number;
    });
    /**
     * Queue something in the Bucket
     * @arg {Function} func A callback to call when a token can be consumed
     */
    queue(func: () => void): void;
    check(): void;
}
