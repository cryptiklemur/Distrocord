export default class SequentialBucket {
    private limit;
    private remaining;
    private resetInterval;
    private reset;
    private processing?;
    private latencyRef;
    private _queue;
    private last;
    /**
     * Construct a SequentialBucket
     *
     * @arg {Number} tokenLimit The max number of tokens the bucket can consume per interval
     * @arg {Object} [latencyRef] An object
     * @arg {Number} latencyRef.latency Interval between consuming tokens
     */
    constructor(limit: any, latencyRef: any);
    /**
     * Queue something in the SequentialBucket
     * @arg {Function} func A function to call when a token can be consumed. The function will be passed a callback
     *     argument, which must be called to allow the bucket to continue to work
     */
    queue(func: any, short: any): void;
    check(override?: any): any;
}
