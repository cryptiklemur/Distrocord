import Kernel from "../Kernel";
import {instanceMethod, InstanceType, prop, Ref} from "typegoose";
import User from "./User";
import Guild from "./Guild";
import Base from "./AbstractModel";
import Permission from "./Permission";

export default class Role extends Base {
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
        return '<@' + this.identifier + '>';
    }
}

export const RoleModel = new Role().getModelForClass(Role);