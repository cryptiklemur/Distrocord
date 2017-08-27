import {arrayProp, instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Collection from "../Helper/Collection";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";
import Guild from "./Guild";
import Message from "./Message";
import PermissionOverwrite from "./PermissionOverwrite";
import User from "./User";

export enum ChannelType {
    GUILD_TEXT,
    DM,
    GUILD_VOICE,
    GROUP_DM,
    GUILD_CATEGORY,
}

export default class Channel extends AbstractModel {
    @prop({ref: {name: "Guild"}})
    public guild?: Ref<Guild>;

    @prop({ref: {name: "User"}})
    public user?: Ref<User>;

    @prop({required: true})
    public type: ChannelType;

    @prop()
    public name?: string;

    @prop()
    public position?: number;

    @prop()
    public topic?: string;

    @prop()
    public bitrate?: number;

    @prop()
    public userLimit?: number;

    @prop()
    public nsfw?: boolean;

    public permissionOverwrites: Collection<PermissionOverwrite>;

    public messages: Collection<Message>;

    @instanceMethod
    public get mention(this: InstanceType<Channel>) {
        if (this.type === ChannelType.DM) {
            return;
        }

        return "<#" + this.identifier + ">";
    }

    @instanceMethod
    public async initialize(
        this: InstanceType<Channel>,
        data: any,
        kernel: Kernel,
        parent?: Guild & User,
    ): Promise<void> {
        this.type = data.type;
        if (this.type === ChannelType.DM) {
            this.user = parent;
        } else {
            this.guild     = parent;
        }

        this.messages = new Collection<Message>(Message, kernel.configuration.messageLimit);

        await this.update(data, kernel);
    }

    @instanceMethod
    public update(this: InstanceType<Channel>, data: any, kernel: Kernel): Promise<any> {
        if (this.type === ChannelType.DM) {
            return;
        }
        this.name      = data.name !== undefined ? data.name : this.name;
        this.topic     = data.topic !== undefined ? data.topic : this.topic;
        this.position  = data.position !== undefined ? data.position : this.position;
        this.bitrate   = data.bitrate !== undefined ? data.bitrate : this.bitrate;
        this.userLimit = data.user_limit !== undefined ? data.user_limit : this.userLimit;

        this.nsfw = this.type !== ChannelType.GUILD_VOICE &&
                    ((this.name.length === 4 ? this.name === "nsfw" : this.name.startsWith("nsfw-")) || data.nsfw);

        if (data.permission_overwrites) {
            this.permissionOverwrites = new Collection<PermissionOverwrite>(PermissionOverwrite);
            data.permission_overwrites.forEach((overwrite) => {
                this.permissionOverwrites.add(overwrite);
            });
        }
    }
}

export const ChannelModel = new Channel().getModelForClass(Channel);
