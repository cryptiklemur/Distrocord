import Kernel from "../Kernel";
import {arrayProp, prop, Ref} from "typegoose";
import User from "./User";
import Guild from "./Guild";
import Base from "./AbstractModel";
import Role from "./Role";
import Permission from "./Permission";

export default class Member extends Base {
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
}

export const MemberModel = new Member().getModelForClass(Member);