import {prop, SchemaDocument} from "mongot";
import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";

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
    public id: string;

    @prop
    public type: ChannelType;

    public get createdAt(): Date {
        return new Date((+this.id / 4194304) + 1420070400000);
    }
}
