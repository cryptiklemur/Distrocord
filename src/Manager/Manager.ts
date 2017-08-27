import {Long} from "bson";
import Kernel from "../Kernel";
import AbstractModel from "../Model/AbstractModel";

export default class Manager<T extends AbstractModel> {
    constructor(protected kernel: Kernel, protected cls: any, protected parent?: AbstractModel) {
    }

    public async add(data: any): Promise<T> {
        let cls: T = await this.get(data.id) || <T> new this.cls();
        await cls.initialize(data, this.kernel, this.parent);

        return await this.save(cls);
    }

    public async get(identifier: Long): Promise<T> {
        return <T> await this.cls.findByIdentifier(identifier);
    }

    public async all(): Promise<T[]> {
        return <T[]> await this.cls.find({});
    }

    public async update(identifier: Long, data: any, persist: boolean = true): Promise<T> {
        let cls = await this.get(identifier);
        await cls.update(data, this.kernel);

        if (!persist) {
            return cls;
        }

        return this.save(cls);
    }

    public async save(cls: any): Promise<T> {
        await cls.save();

        return <T> cls;
    }

    public async count(query: any = {}): Promise<number> {
        return await this.cls.count(query);
    }

    public async remove(identifier: Long): Promise<T> {
        let instance: any = await this.get(identifier);
        await instance.remove();

        return instance;
    }

    public async forEach(callback: { (value: T, index: number, array: T[]): void}, parallel: boolean = false): Promise<void> {
        const instances = await this.all();
        let promises = [];
        if (parallel) {
            instances.forEach((instance, index, arr) => promises.push(callback(instance, index, arr)));

            await Promise.all(promises);

            return;
        } else {
            for (let i = 0; i < instances.length; i++) {
                let instance = instances[i];
                await callback(instance, i, instances);
            }
        }
    }
}
