import Kernel from "../../Kernel";
import Shard from "../Shard";

export default abstract class AbstractEvent {
    private _op: number;
    private _data: any;
    private _sequence: number;
    private _type: string;

    protected get op() {
        return this._op;
    }

    protected get sequence() {
        return this._sequence;
    }

    protected get type() {
        return this._type;
    }

    protected get data(): any {
        return this._data;
    }

    constructor(protected kernel: Kernel, protected shard: Shard) {
    }

    public async doHandle(packet: { op: number, d: any, s: number, t: string }): Promise<void> {
        this._op       = packet.op;
        this._data     = packet.d;
        this._sequence = packet.s;
        this._type     = packet.t;

        return await this.handle();
    }

    public async abstract handle(): Promise<void>;

    protected emit(event, ...args) {
        this.kernel.emit.call(this.kernel, event, ...args);
    }
}
