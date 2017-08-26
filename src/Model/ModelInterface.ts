import {Long} from "bson";
import {instanceMethod, InstanceType, prop, Typegoose} from "typegoose";
import Kernel from "../Kernel";

interface ModelInterface {
    readonly identifier: Long;
    readonly createdAt: number;

    initialize(data: any, kernel: Kernel);

    update(data: any, kernel: Kernel);

    toJSON(arg, cache);

    inspect();
}

export default ModelInterface;