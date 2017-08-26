import {Long} from "bson";
import Kernel from "../Kernel";
import AbstractModel from "../Model/AbstractModel";

export default class Manager<T extends AbstractModel> {
    constructor(protected kernel: Kernel, protected cls: any, protected parent?: AbstractModel) {
    }

    public async add(data: any): Promise<T> {
        let cls: T = <T> new this.cls();
        await cls.initialize(data, this.kernel, this.parent);

        return await this.save(cls);
    }

    public async get(identifier: Long): Promise<T> {
        return <T> await this.cls.findByIdentifier(identifier);
    }

    public async update(identifier: Long, data: any): Promise<T> {
        let cls = await this.get(identifier);
        await cls.update(data, this.kernel);

        return this.save(cls);
    }

    public async save(cls: any): Promise<T> {
        await cls.save();

        return <T> cls;
    }

    public async count(query: any = {}): Promise<number> {
        return await this.cls.count(query);
    }
}
