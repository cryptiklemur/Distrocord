import Kernel from "../Kernel";
import {arrayProp, instanceMethod, InstanceType, prop, Ref} from "typegoose";
import User from "./User";
import Guild from "./Guild";
import AbstractModel from "./AbstractModel";
import Role from "./Role";
import Permission from "./Permission";

export default class Member extends AbstractModel {
    @prop({ref: User})
    public user: Ref<User>;

    @prop({ref: Guild})
    public guild: Ref<Guild>;

    @prop()
    public joinedAt: Date;

    @arrayProp({itemsRef: Role})
    public roles: Ref<Role>[];

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