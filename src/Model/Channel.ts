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

export default class Channel extends SchemaDocument implements ModelInterface {
    public kernel: Kernel;

    @prop
    public identifier: string;

    @prop
    public type: ChannelType;

    public get createdAt(): Date {
        return new Date((+this.identifier / 4194304) + 1420070400000);
    }
}
