import Timer = NodeJS.Timer;
import Shard from "../Gateway/Shard";
import Collection from "../Helper/Collection";

export default class ShardHandler extends Collection<Shard> {
    private connectQueue: any[]          = [];
    private lastConnect: number          = 0;
    private connectTimeout: null | Timer = null;

    constructor(private kernel) {
        super(Shard);
    }

    public readyPacketCB() {
        this.lastConnect = Date.now();
        this.tryConnect();
    }

    public connect(shard) {
        if (this.lastConnect <= Date.now() - 5000 && !this.find((s) => s.connecting)) {
            shard.connect();
            this.lastConnect = Date.now() + 7500;
        } else {
            this.connectQueue.push(shard);
            this.tryConnect();
        }
    }

    public tryConnect() {
        if (this.connectQueue.length > 0) {
            if (this.lastConnect <= Date.now() - 5000) {
                const shard = this.connectQueue.shift();
                shard.connect();
                this.lastConnect = Date.now() + 7500;
            } else if (!this.connectTimeout) {
                this.connectTimeout = setTimeout(() => {
                    this.connectTimeout = null;
                    this.tryConnect();
                }, 1000);
            }
        }
    }

    public spawn(id) {
        let shard = this.get(id);
        if (!shard) {
            shard = this.add(new Shard(id, this.kernel));
            shard.on("ready", () => {
                /**
                 * Fired when a shard turns ready
                 * @event kernel#shardReady
                 * @prop {Number} id The ID of the shard
                 */
                this.kernel.emit("shardReady", shard.id);
                if (this.kernel.ready) {
                    return;
                }
                for (const other of this) {
                    if (!other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready     = true;
                this.kernel.startTime = Date.now();
                /**
                 * Fired when all shards turn ready
                 * @event kernel#ready
                 */
                this.kernel.emit("ready");
            }).on("resume", () => {
                /**
                 * Fired when a shard resumes
                 * @event kernel#shardResume
                 * @prop {Number} id The ID of the shard
                 */
                this.kernel.emit("shardResume", shard.id);
                if (this.kernel.ready) {
                    return;
                }
                for (const other of this) {
                    if (!other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready     = true;
                this.kernel.startTime = Date.now();
                this.kernel.emit("ready");
            }).on("disconnect", (error) => {
                /**
                 * Fired when a shard disconnects
                 * @event kernel#shardDisconnect
                 * @prop {Error?} error The error, if any
                 * @prop {Number} id The ID of the shard
                 */
                this.kernel.emit("shardDisconnect", error, shard.id);
                for (const other of this) {
                    if (other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready     = false;
                this.kernel.startTime = 0;
                /**
                 * Fired when all shards disconnect
                 * @event kernel#disconnect
                 */
                this.kernel.emit("disconnect");
            });
        }
        if (shard.status === "disconnected") {
            this.connect(shard);
        }
    }
}
