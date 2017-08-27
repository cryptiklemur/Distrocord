import {instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";
import Guild from "./Guild";
import Permission from "./Permission";

export default class Role extends AbstractModel {
    @prop({required: true})
    public name: string;

    @prop({required: true})
    public mentionable: boolean;

    @prop({required: true})
    public managed: boolean;

    @prop({required: true})
    public hoisted: boolean;

    @prop({required: true})
    public color: number;

    @prop({required: true})
    public position: number;

    @prop({ref: {name: "Guild"}, required: true})
    public guild: Ref<Guild>;

    @prop({ref: Permission})
    public permissions: Permission;

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
