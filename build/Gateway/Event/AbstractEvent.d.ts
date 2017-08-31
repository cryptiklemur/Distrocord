import Kernel from "../../Kernel";
import Shard from "../Shard";
export default abstract class AbstractEvent {
    protected kernel: Kernel;
    protected shard: Shard;
    private _op;
    private _data;
    private _sequence;
    private _type;
    protected readonly op: number;
    protected readonly data: any;
    protected readonly sequence: number;
    protected readonly type: string;
    constructor(kernel: Kernel, shard: Shard);
    doHandle(packet: {
        op: number;
        d: any;
        s: number;
        t: string;
    }): Promise<void>;
    abstract handle(): Promise<void>;
    protected emit(event: any, ...args: any[]): void;
}
