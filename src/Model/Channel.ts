import Collection from "../Helper/Collection";
import Kernel from "../Kernel";
import Message from "./Message";
import ModelInterface from "./ModelInterface";
import PermissionOverwrite from "./PermissionOverwrite";
import {prop, SchemaDocument, SchemaFragmentArray, document} from "mongot";

export enum ChannelType {
    GUILD_TEXT,
    DM,
    GUILD_VOICE,
    GROUP_DM,
    GUILD_CATEGORY,
}

@document
export default class Channel extends SchemaDocument implements ModelInterface {
    @prop
    public identifier: string;

    public get createdAt(): Date {
        return new Date((+this.identifier / 4194304) + 1420070400000);
    }

    @prop
    public guild?: string;

    @prop
    public user?: string;

    @prop
    public type: ChannelType;

    @prop
    public name?: string;

    @prop
    public position?: number;

    @prop
    public topic?: string;

    @prop
    public bitrate?: number;

    @prop
    public userLimit?: number;

    @prop
    public nsfw?: boolean;

    @prop(PermissionOverwrite)
    public permissionOverwrites: SchemaFragmentArray<PermissionOverwrite>;

    public messages: Collection<Message>;

    public get mention() {
        if (this.type === ChannelType.DM) {
            return;
        }

        return "<#" + this.identifier + ">";
    }

    public kernel: Kernel;
}
