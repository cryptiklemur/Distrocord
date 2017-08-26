import {instanceMethod, InstanceType, prop} from "typegoose";
import {Permissions} from "../Config/Constants";
import Kernel from "../Kernel";
import Base from "./AbstractModel";
import Permission from "./Permission";

export type Type = "user" | "role";

export default class PermissionOverwrite extends Permission {
    @prop()
    public type: Type;
}

export const PermissionOverwriteModel = new PermissionOverwrite().getModelForClass(PermissionOverwrite);