import {arrayProp, instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";
import Guild from "./Guild";
import Permission from "./Permission";
import Role from "./Role";
import User from "./User";

export default class Member extends AbstractModel {
    @prop({ref: User, required: true})
    public user: Ref<User>;

    @prop({ref: {name: "Guild"}, required: true})
    public guild: Ref<Guild>;

    @prop()
    public joinedAt: Date;

    @arrayProp({itemsRef: {name: "Role"}})
    public roles: Array<Ref<Role>>;

    @prop()
    public permission: Permission;

    @instanceMethod
    public initialize(this: InstanceType<Member>, data: any, kernel: Kernel, parent?: AbstractModel): Promise<any> {
        return undefined;
    }

    @instanceMethod
    public update(this: InstanceType<Member>, data: any, kernel: Kernel): Promise<any> {
        return undefined;
    }
}

export const MemberModel = new Member().getModelForClass(Member);
