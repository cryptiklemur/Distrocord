import {Long} from "bson";
import {instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose} from "typegoose";
import Kernel from "../Kernel";

export default abstract class AbstractModel extends Typegoose {
    @staticMethod
    public static async findByIdentifier(this: ModelType<AbstractModel> & typeof AbstractModel, identifier: Long) {
        return await this.findOne({identifier});
    }

    @prop({required: true, index: true, unique: true})
    public identifier: string;

    @prop({index: true})
    public get createdAt(this: InstanceType<AbstractModel>): number {
        return (+this.identifier.toString() / 4194304) + 1420070400000;
    }

    public abstract async initialize(data: any, kernel: Kernel, parent?: AbstractModel);

    public abstract async update(data: any, kernel: Kernel);

    @instanceMethod
    public toJSON(this: InstanceType<AbstractModel>, cache: any[] = []) {
        if (~cache.indexOf(this)) {
            return "[Circular]";
        } else {
            cache.push(this);
        }

        const copy: any = {};
        for (const key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }
            const val: any = this[key];

            if (this.hasOwnProperty(key) && !key.startsWith("_")) {
                if (this[key] instanceof Set) {
                    copy[key] = Array.from(val);
                } else if (this[key] instanceof Map) {
                    copy[key] = Array.from(val.values());
                } else if (typeof val.toJSON === "function") {
                    copy[key] = val.toJSON(key, cache);
                } else {
                    copy[key] = val;
                }
            }
        }
        return copy;
    }
}
