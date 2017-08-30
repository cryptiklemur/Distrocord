import {Long} from "bson";
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

export default abstract class Channel extends SchemaDocument implements ModelInterface {
    public kernel: Kernel;

    @prop
    public id: Long;

    public get createdAt(): Date {
        return new Date(+this.id.div(Long.fromNumber(4194304)).add(Long.fromNumber(1420070400000)).toString());
    }
}
