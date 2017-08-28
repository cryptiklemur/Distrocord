import {SchemaFragmentArray} from "mongot";
import ChannelPacket from "../../Gateway/Packet/ChannelPacket";
import Collection from "../../Helper/Collection";
import mergeById from "../../Helper/mergeById";
import {ChannelType} from "../../Model/Channel";
import Guild from "../../Model/Guild";
import GuildChannel from "../../Model/GuildChannel";
import Message from "../../Model/Message";
import ModelInterface from "../../Model/ModelInterface";
import PermissionOverwrite from "../../Model/PermissionOverwrite";
import AbstractModelManager from "./AbstractModelManager";

export default class GuildChannelManager extends AbstractModelManager<GuildChannel> {
    public async initialize(model: GuildChannel, data: ChannelPacket, parent: Guild | ModelInterface): Promise<void> {
        this.updateField(model, "id", data, "id", (x) => x.toString())
            .updateField(model, "type", data, null, (x) => x as ChannelType)
            .updateField(model, "guild", parent, "id");

        model.messages = new Collection<Message>(Message, this.kernel.configuration.messageLimit);
    }

    public async update(model: GuildChannel, data: ChannelPacket): Promise<void> {
        this.updateField(model, "name", data)
            .updateField(model, "topic", data)
            .updateField(model, "position", data)
            .updateField(model, "bitrate", data)
            .updateField(model, "userLimit", data, "user_limit");

        model.nsfw = model.type !== ChannelType.GUILD_VOICE &&
                     ((model.name.length === 4 ? model.name === "nsfw" : model.name.startsWith("nsfw-")) || data.nsfw);

        if (data.permission_overwrites) {
            model.permissionOverwrites = new SchemaFragmentArray<PermissionOverwrite>(
                mergeById(model.permissionOverwrites, data.permission_overwrites),
            );
        }
    }
}
