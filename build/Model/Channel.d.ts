import { Long } from "bson";
import { SchemaDocument } from "mongot";
import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";
export declare enum ChannelType {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
}
export default abstract class Channel extends SchemaDocument implements ModelInterface {
    kernel: Kernel;
    id: Long;
    readonly createdAt: Date;
}
