import {arrayProp, instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Guild from "./Guild";
import Base from "./AbstractModel";
import Message from "./Message";
import PermissionOverwrite from "./PermissionOverwrite";

export type ChannelType = 0 | 2;

export default class Channel extends Base {
    @prop({ref: Guild})
    public guild?: Ref<Guild>;

    @arrayProp({itemsRef: PermissionOverwrite})
    public roles: Ref<PermissionOverwrite>[];

    @prop()
    public type: ChannelType;

    @prop()
    public name: string;

    @prop()
    public position: number;

    @prop()
    public topic?: string;

    @prop()
    public bitrate?: number;

    @prop()
    public userLimit?: number;

    @prop()
    public nsfw: boolean;

    public messages: Array<Message>;

    @instanceMethod
    public get mention(this: InstanceType<Channel>) {
        if (!this.guild) {
            return;
        }

        return '<#' + this.identifier + '>';
    }
}

export const ChannelModel = new Channel().getModelForClass(Channel);