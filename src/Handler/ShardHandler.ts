import Collection from "../Helper/Collection";
import Timer = NodeJS.Timer;

export default class ShardHandler extends Collection<Shard> {
    private connectQueue: Array<any> = [];
    private lastConnect: number = 0;
    private connectTimeout: null|Timer = null;

    constructor(private kernel) {
        super(Shard);
    }

    readyPacketCB() {
        this.lastConnect = Date.now();
        this.tryConnect();
    }

    connect(shard) {
        if(this.lastConnect <= Date.now() - 5000 && !this.find((shard) => shard.connecting)) {
            shard.connect();
            this.lastConnect = Date.now() + 7500;
        } else {
            this.connectQueue.push(shard);
            this.tryConnect();
        }
    }

    tryConnect() {
        if(this.connectQueue.length > 0) {
            if(this.lastConnect <= Date.now() - 5000) {
                var shard = this.connectQueue.shift();
                shard.connect();
                this.lastConnect = Date.now() + 7500;
            } else if(!this.connectTimeout) {
                this.connectTimeout = setTimeout(() => {
                    this.connectTimeout = null;
                    this.tryConnect();
                }, 1000);
            }
        }
    }

    spawn(id) {
        var shard = this.get(id);
        if(!shard) {
            shard = this.add(new Shard(id, this.kernel));
            shard.on("ready", () => {
                /**
                * Fired when a shard turns ready
                * @event kernel#shardReady
                * @prop {Number} identifier The ID of the shard
                */
                this.kernel.emit("shardReady", shard.id);
                if(this.kernel.ready) {
                    return;
                }
                for(var other of this) {
                    if(!other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready = true;
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
                * @prop {Number} identifier The ID of the shard
                */
                this.kernel.emit("shardResume", shard.id);
                if(this.kernel.ready) {
                    return;
                }
                for(var other of this) {
                    if(!other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready = true;
                this.kernel.startTime = Date.now();
                this.kernel.emit("ready");
            }).on("disconnect", (error) => {
                /**
                * Fired when a shard disconnects
                * @event kernel#shardDisconnect
                * @prop {Error?} error The error, if any
                * @prop {Number} identifier The ID of the shard
                */
                this.kernel.emit("shardDisconnect", error, shard.id);
                for(var other of this) {
                    if(other[1].ready) {
                        return;
                    }
                }
                this.kernel.ready = false;
                this.kernel.startTime = 0;
                /**
                * Fired when all shards disconnect
                * @event kernel#disconnect
                */
                this.kernel.emit("disconnect");
            });
        }
        if(shard.status === "disconnected") {
            this.connect(shard);
        }
    }
}
