import {instanceMethod, InstanceType, prop} from "typegoose";
import Kernel from "../Kernel";
import Base from "./AbstractModel";
import Permission from "./Permission";

export type Type = "member" | "role";

export default class PermissionOverwrite extends Permission {
    @prop({required: true})
    public type: Type;

    @instanceMethod
    public async initialize(
        this: InstanceType<PermissionOverwrite>,
        data: any,
        kernel: Kernel,
        parent?: Base,
    ): Promise<void> {
        this.type = data.type;

        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<PermissionOverwrite>, kernel: Kernel): Promise<void> {
        return;
    }
}

export const PermissionOverwriteModel = new PermissionOverwrite().getModelForClass(PermissionOverwrite);
