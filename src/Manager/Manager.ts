import {Long} from "bson";
import {InstanceType, ModelType} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "../Model/AbstractModel";

export default class Manager<T extends AbstractModel> {
    constructor(protected kernel: Kernel, protected cls: ModelType<T>, protected parent?: AbstractModel) {
    }

    public async add(data: any): Promise<T> {
        try {
            const cls: InstanceType<T> = await this.get(data.id) || new this.cls();
            cls.identifier = data.id;
            await cls.initialize(data, this.kernel, this.parent);

            return await this.save(cls);
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async get(identifier: Long): Promise<InstanceType<T>> {
        try {
            return await this.cls.findOne({identifier});
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async all(): Promise<Array<InstanceType<T>>> {
        try {
            return await this.cls.find({}) as Array<InstanceType<T>>;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async update(identifier: Long, data: any, persist: boolean = true): Promise<InstanceType<T>> {
        try {
            let cls: InstanceType<T> = await this.get(identifier);
            if (!cls) {
                cls = new this.cls({identifier: data.id});
                cls.identifier = data.id;
                await cls.initialize(data, this.kernel, this.parent);
            } else {
                await cls.update(data, this.kernel);
            }

            if (!persist) {
                return cls;
            }

            return await this.save(cls);
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async save(cls: InstanceType<T>): Promise<InstanceType<T>> {
        try {
            const e: any = await cls.validate();

            Kernel.logger.debug("[Manager] Saving: ", JSON.stringify(cls.toJSON()));
            await cls.save();
        } catch (e) {
            for (const field in e.errors) {
                if (e.errors.hasOwnProperty(field)) {
                    this.kernel.emit(
                        "error",
                        `In ${this.cls.modelName} on object ${cls.identifier}: ` + e.errors[field].message,
                    );
                }
            }
        }

        return cls;
    }

    public async count(query: any = {}): Promise<number> {
        try {
            return await this.cls.count(query);
        } catch (e) {
            this.kernel.emit("error", e);
            setTimeout(() => process.exit(1), 30);
        }
    }

    public async remove(identifier: Long): Promise<InstanceType<T>> {
        try {
            const instance: any = await this.get(identifier);
            await instance.remove();

            return instance;
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }

    public async forEach(
        callback: (value: InstanceType<T>, index: number, array: T[]) => void,
        parallel: boolean = false,
    ): Promise<void> {
        try {
            const instances = await this.all();
            const promises  = [];
            if (parallel) {
                instances.forEach((instance, index, arr) => promises.push(callback(instance, index, arr)));

                await Promise.all(promises).catch((e) => Kernel.logger.error(e));

                return;
            } else {
                for (let i = 0; i < instances.length; i++) {
                    const instance = instances[i];
                    await callback(instance, i, instances);
                }
            }
        } catch (e) {
            this.kernel.emit("error", e);
        }
    }
}
