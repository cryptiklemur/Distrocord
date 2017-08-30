import {Long} from "bson";
import AbstractCollection from "../Collection/AbstractCollection";
import Kernel from "../Kernel";
import DocumentInterface from "../Model/DocumentInterface";
import AbstractModelManager from "./ModelManager/AbstractModelManager";

export default class Manager<T extends DocumentInterface> {
    constructor(
        protected kernel: Kernel,
        protected collection: AbstractCollection<T>,
        protected manager: AbstractModelManager<T>,
    ) {
    }

    public async upsert(data: any): Promise<any> {

        try {
            const cls = this.collection.factory(data);
            await this.manager.doInitialize(cls, data);

            delete cls.kernel;
            const result = await this.collection.findOneAndUpdate({id: data.id}, cls, {upsert: true});
            cls.kernel   = this.kernel;

            return result.get() as T;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async get(id: Long | string): Promise<T> {
        try {
            const model  = await this.collection.findById(id instanceof Long ? id.toString() : id) as T;
            model.kernel = this.kernel;

            return model;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async all(): Promise<T[]> {
        try {
            const models = await (await this.collection.find()).fetchAll() as T[];
            models.forEach((model) => model.kernel = this.kernel);

            return models;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async count(query: any = {}): Promise<number> {
        try {
            return await this.collection.count(query, {});
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async remove(id: Long | T): Promise<T> {
        try {
            let instance;
            if (id instanceof Long) {
                instance = await this.collection.findById(id);
            }

            await this.collection.deleteOne(instance);

            return instance;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async forEach(
        callback: (value: T, index: number, array: T[]) => void,
        parallel: boolean = false,
    ): Promise<void> {
        try {
            const instances = await this.all();
            const promises  = [];
            if (parallel) {
                instances.forEach((instance, index, arr) => {
                    instance.kernel = this.kernel;
                    promises.push(callback(instance, index, arr));
                });

                await Promise.all(promises).catch((e) => Kernel.logger.error(e));

                return;
            } else {
                for (let i = 0; i < instances.length; i++) {
                    const instance  = instances[i];
                    instance.kernel = this.kernel;
                    await callback(instance, i, instances);
                }
            }
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }
}
