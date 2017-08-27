import {arrayProp, instanceMethod, InstanceType, prop, Ref} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";
import Guild from "./Guild";
import Message from "./Message";
import PermissionOverwrite from "./PermissionOverwrite";

export type ChannelType = 0 | 2;

export default class Channel extends AbstractModel {
    @prop({ref: Guild})
    public guild?: Ref<Guild>;

    @arrayProp({itemsRef: PermissionOverwrite})
    public roles: Array<Ref<PermissionOverwrite>>;

    @prop({required: true})
    public type: ChannelType;

    @prop({required: true})
    public name: string;

    @prop({required: true})
    public position: number;

    @prop()
    public topic?: string;

    @prop()
    public bitrate?: number;

    @prop()
    public userLimit?: number;

    @prop({required: true, default: false})
    public nsfw: boolean;

    public messages: Message[];

    @instanceMethod
    public get mention(this: InstanceType<Channel>) {
        if (!this.guild) {
            return;
        }

        return "<#" + this.identifier + ">";
    }

    @instanceMethod
    public initialize(this: InstanceType<Channel>, data: any, kernel: Kernel, parent?: AbstractModel): Promise<any> {
        return undefined;
    }

    @instanceMethod
    public update(this: InstanceType<Channel>, data: any, kernel: Kernel): Promise<any> {
        return undefined;
    }
}

export const ChannelModel = new Channel().getModelForClass(Channel);
