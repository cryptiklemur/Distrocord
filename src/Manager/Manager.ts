import {Long} from "bson";
import Kernel from "../Kernel";
import AbstractModel from "../Model/AbstractModel";

export default class Manager<T extends AbstractModel> {
    constructor(protected kernel: Kernel, protected cls: any, protected parent?: AbstractModel) {
    }

    public async add(data: any): Promise<T> {
        const cls: T = await this.get(data.id) || new this.cls() as T;
        await cls.initialize(data, this.kernel, this.parent);

        return await this.save(cls);
    }

    public async get(identifier: Long): Promise<T> {
        return await this.cls.findByIdentifier(identifier) as T;
    }

    public async all(): Promise<T[]> {
        return await this.cls.find({}) as T[];
    }

    public async update(identifier: Long, data: any, persist: boolean = true): Promise<T> {
        const cls = await this.get(identifier);
        await cls.update(data, this.kernel);

        if (!persist) {
            return cls;
        }

        return this.save(cls);
    }

    public async save(cls: any): Promise<T> {
        await cls.save();

        return cls as T;
    }

    public async count(query: any = {}): Promise<number> {
        return await this.cls.count(query);
    }

    public async remove(identifier: Long): Promise<T> {
        const instance: any = await this.get(identifier);
        await instance.remove();

        return instance;
    }

    public async forEach(
        callback: (value: T, index: number, array: T[]) => void,
        parallel: boolean = false,
    ): Promise<void> {
        const instances = await this.all();
        const promises  = [];
        if (parallel) {
            instances.forEach((instance, index, arr) => promises.push(callback(instance, index, arr)));

            await Promise.all(promises);

            return;
        } else {
            for (let i = 0; i < instances.length; i++) {
                const instance = instances[i];
                await callback(instance, i, instances);
            }
        }
    }
}
