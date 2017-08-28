export default class SequentialBucket {
    private limit: number;
    private remaining: number;
    private resetInterval: number           = 0;
    private reset: number                   = 0;
    private processing?: any;
    private latencyRef: { latency: number } = {latency: 0};
    private _queue: any[]                   = [];
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
    public queue(func, short) {
        if (short) {
            this._queue.unshift(func);
        } else {
            this._queue.push(func);
        }
        this.check();
    }

    public check(override?) {
        if (this.queue.length === 0) {
            if (this.processing) {
                clearTimeout(this.processing);
                this.processing = undefined;
            }
            return;
        }
        if (this.processing && !override) {
            return;
        }

        const now = Date.now();
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
                this.processing = undefined;
                this.check(true);
            }, Math.max(0, this.reset || 0 - now) + this.latencyRef.latency);
            return;
        }

        --this.remaining;
        this.processing = true;

        const func = this._queue.shift();
        if (!func) {
            return this.processing = undefined;
        }

        func(() => {
            if (this.queue.length > 0) {
                this.check(true);
            } else {
                this.processing = undefined;
            }
        });
    }
}
