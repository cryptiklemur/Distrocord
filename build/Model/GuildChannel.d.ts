import { Long } from "bson";
import { SchemaFragmentArray } from "mongot";
import Collection from "../Helper/Collection";
import Channel, { ChannelType } from "./Channel";
import Message from "./Message";
import ModelInterface from "./ModelInterface";
import PermissionOverwrite from "./PermissionOverwrite";
export default class GuildChannel extends Channel implements ModelInterface {
    guild: Long;
    type: ChannelType;
    name: string;
    position: number;
    topic: string;
    bitrate?: number;
    userLimit?: number;
    nsfw?: boolean;
    permissionOverwrites: SchemaFragmentArray<PermissionOverwrite>;
    messages: Collection<Message>;
    readonly mention: string;
}
