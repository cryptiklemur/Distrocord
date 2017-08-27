import {Long} from "bson";
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

    @prop()
    public nick: string;

    @arrayProp({itemsRef: {name: "Role"}})
    public roles: Array<Ref<Role>>;

    @instanceMethod
    public async initialize(this: InstanceType<Member>, data: any, kernel: Kernel, parent?: Guild): Promise<void> {
        this.guild      = parent;
        this.identifier = data.user.id;
        this.user       = await kernel.users.get(Long.fromString(data.user.id));

        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<Member>, data: any, kernel: Kernel): Promise<void> {
        this.joinedAt = data.joined_at !== undefined ? new Date(data.joined_at) : this.joinedAt;
        this.nick     = data.nick !== undefined ? data.nick : this.nick || null;
        if (data.roles !== undefined) {
            this.roles = [];
            for (const id of data.roles) {
                const role = await (this.guild as Guild).roles.get(id);
                if (role) {
                    this.roles.push(role);
                }
            }
        }
    }
}

export const MemberModel = new Member().getModelForClass(Member);
