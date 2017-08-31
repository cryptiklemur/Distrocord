import Shard from "../Gateway/Shard";
import Collection from "../Helper/Collection";
export default class ShardHandler extends Collection<Shard> {
    private kernel;
    private connectQueue;
    private lastConnect;
    private connectTimeout;
    constructor(kernel: any);
    readyPacketCB(): void;
    connect(shard: any): void;
    tryConnect(): void;
    spawn(id: any): void;
}
