import {instanceMethod, InstanceType, prop} from "typegoose";
import Kernel from "../Kernel";
import Base from "./AbstractModel";
import Permission from "./Permission";

export type Type = "member" | "role";

export default class PermissionOverwrite extends Permission {
    @prop()
    public type: Type;

    @instanceMethod
    public async initialize(this: InstanceType<PermissionOverwrite>, data: any, kernel: Kernel, parent?: Base) {
        throw new Error("Method not implemented.");
    }

    @instanceMethod
    public async update(this: InstanceType<PermissionOverwrite>, kernel: Kernel) {
        throw new Error("Method not implemented.");
    }
}

export const PermissionOverwriteModel = new PermissionOverwrite().getModelForClass(PermissionOverwrite);