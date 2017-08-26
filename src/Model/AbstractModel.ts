import {Long} from "bson";
import {instanceMethod, InstanceType, ModelType, prop, staticMethod, Typegoose} from "typegoose";
import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";

export default abstract class AbstractModel extends Typegoose implements ModelInterface {
    @prop({required: true, index: true, unique: true})
    public identifier: Long;

    @instanceMethod @prop({index: true})
    public get createdAt(this: InstanceType<AbstractModel>): number {
        return (+this.identifier.toString() / 4194304) + 1420070400000;
    }

    public abstract async initialize(data: any, kernel: Kernel, parent?: AbstractModel);

    public abstract async update(data: any, kernel: Kernel);

    @staticMethod
    public static async findByIdentifier(this: ModelType<AbstractModel> & typeof AbstractModel, identifier: Long) {
        return await this.findOne({identifier});
    }

    public toJSON(arg, cache) {
        cache = cache || [];
        if (~cache.indexOf(this)) {
            return "[Circular]";
        } else {
            cache.push(this);
        }

        let copy: any = {};
        for (var key in this) {
            let val: any = this[key];

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

    public inspect() {
        // http://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript
        let copy = new (new Function(`return function ${this.constructor.name}(){}`)());
        for (let key in this) {
            if (this.hasOwnProperty(key) && !key.startsWith("_") && this[key]) {
                copy[key] = this[key];
            }
        }
        return copy;
    }
}
