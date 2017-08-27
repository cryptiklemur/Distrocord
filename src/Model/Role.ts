import Kernel from "../Kernel";
import {instanceMethod, InstanceType, prop, Ref} from "typegoose";
import User from "./User";
import Guild from "./Guild";
import AbstractModel from "./AbstractModel";
import Permission from "./Permission";

export default class Role extends AbstractModel {
    @prop()
    public name: string;

    @prop()
    public mentionable: boolean;

    @prop()
    public managed: boolean;

    @prop()
    public hoisted: boolean;

    @prop()
    public color: number;

    @prop()
    public position: number;

    @prop({ref: User})
    public user: Ref<User>;

    @prop({ref: Guild})
    public guild: Ref<Guild>;

    @prop()
    public permission: Permission;

    @instanceMethod
    public get mention(this: InstanceType<Role>) {
        return "<@" + this.identifier + ">";
    }

    @instanceMethod
    public initialize(this: InstanceType<Role>, data: any, kernel: Kernel, parent?: AbstractModel): Promise<any> {
        return undefined;
    }

    @instanceMethod
    public update(this: InstanceType<Role>, data: any, kernel: Kernel): Promise<any> {
        return undefined;
    }
}

export const RoleModel = new Role().getModelForClass(Role);