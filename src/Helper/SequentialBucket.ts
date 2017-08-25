/**
 * Ratelimit requests and release in sequence
 *
 * @prop {Number} limit How many tokens the bucket can consume in the current interval
 * @prop {Number} remaining How many tokens the bucket has left in the current interval
 * @prop {Number} reset Timestamp of next reset
 * @prop {Boolean} processing Whether the queue is being processed
 */
export default class SequentialBucket {
    private limit: number;
    private remaining: number;
    private resetInterval: number           = 0;
    private reset: number                   = 0;
    private processing: boolean | number    = false;
    private latencyRef: { latency: number } = {latency: 0};
    private queue: Array<any>               = [];
    private last: number;

    /**
     * Construct a SequentialBucket
     *
     * @arg {Number} tokenLimit The max number of tokens the bucket can consume per interval
     * @arg {Object} [latencyRef] An object
     * @arg {Number} latencyRef.latency Interval between consuming tokens
     */
    constructor(limit, latencyRef) {
        this.limit = this.remaining = limit;
        if (latencyRef) {
            this.latencyRef = latencyRef;
        }
    }

    /**
     * Queue something in the SequentialBucket
     * @arg {Function} func A function to call when a token can be consumed. The function will be passed a callback
     *     argument, which must be called to allow the bucket to continue to work
     */
    queue(func, short) {
        if (short) {
            this.queue.unshift(func);
        } else {
            this.queue.push(func);
        }
        this.check();
    }

    check(override?) {
        if (this.queue.length === 0) {
            if (this.processing) {
                clearTimeout(this.processing);
                this.processing = false;
            }
            return;
        }
        if (this.processing && !override) {
            return;
        }

        let now = Date.now();
        if (!this.reset) {
            this.reset     = now - this.latencyRef.latency;
            this.remaining = this.limit;
        } else if (this.reset < now - this.latencyRef.latency) {
            this.reset     = now - this.latencyRef.latency + (this.resetInterval || 0);
            this.remaining = this.limit;
        }
        this.last = now;
        if (this.remaining <= 0) {
            this.processing = setTimeout(() => {
                this.processing = false;
                this.check(true);
            }, Math.max(0, this.reset || 0 - now) + this.latencyRef.latency);
            return;
        }
        --this.remaining;
        this.processing = true;
        this.queue.shift()(() => {
            if (this.queue.length > 0) {
                this.check(true);
            } else {
                this.processing = false;
            }
        });
    }
}