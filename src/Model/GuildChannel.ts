import {fragment, prop, SchemaFragmentArray} from "mongot";
import Collection from "../Helper/Collection";
import Channel, {ChannelType} from "./Channel";
import Message from "./Message";
import ModelInterface from "./ModelInterface";
import PermissionOverwrite from "./PermissionOverwrite";

@fragment
export default class GuildChannel extends Channel implements ModelInterface {
    @prop
    public guild: string;

    @prop
    public type: ChannelType;

    @prop
    public name: string;

    @prop
    public position: number;

    @prop
    public topic: string;

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
        return "<#" + this.id + ">";
    }
}
