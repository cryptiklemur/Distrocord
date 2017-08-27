import {instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";
import Guild from "./Guild";
import Permission, {PermissionModel} from "./Permission";

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
    public async initialize(this: InstanceType<Role>, data: any, kernel: Kernel, parent?: Guild): Promise<void> {
        this.guild = parent;

        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<Role>, data: any, kernel: Kernel): Promise<void> {
        this.name        = data.name !== undefined ? data.name : this.name;
        this.mentionable = data.mentionable !== undefined ? data.mentionable : this.mentionable;
        this.managed     = data.managed !== undefined ? data.managed : this.managed;
        this.hoisted       = data.hoist !== undefined ? data.hoist : this.hoisted;
        this.color       = data.color !== undefined ? data.color : this.color;
        this.position    = data.position !== undefined ? data.position : this.position;
        this.permissions = data.permissions !== undefined ? new PermissionModel({allow: data.permissions}) : this.permissions;
    }
}

export const RoleModel = new Role().getModelForClass(Role);
