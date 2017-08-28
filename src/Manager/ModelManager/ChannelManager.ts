import ChannelPacket from "../../Gateway/Packet/ChannelPacket";
import Collection from "../../Helper/Collection";
import Channel, {ChannelType} from "../../Model/Channel";
import Guild from "../../Model/Guild";
import Message from "../../Model/Message";
import ModelInterface from "../../Model/ModelInterface";
import PermissionOverwrite from "../../Model/PermissionOverwrite";
import User from "../../Model/User";
import AbstractModelManager from "./AbstractModelManager";

export default class ChannelManager extends AbstractModelManager<Channel> {
    public async initialize(model: Channel, data: ChannelPacket, parent: User | Guild | ModelInterface): Promise<void> {
        this.updateField(model, "identifier", data, "id", (x) => x.toString())
            .updateField(model, "type", data, null, (x) => x as ChannelType);
        if (model.type === ChannelType.DM) {
            model.user = parent as User;
        } else {
            model.guild = parent as Guild;
        }

        model.messages = new Collection<Message>(Message, this.kernel.configuration.messageLimit);
    }

    public async update(model: Channel, data: ChannelPacket): Promise<void> {
        if (model.type === ChannelType.DM) {
            return;
        }
        this.updateField(model, "name", data)
            .updateField(model, "topic", data)
            .updateField(model, "position", data)
            .updateField(model, "bitrate", data)
            .updateField(model, "userLimit", data, "user_limit");

        model.nsfw = model.type !== ChannelType.GUILD_VOICE &&
                     ((model.name.length === 4 ? model.name === "nsfw" : model.name.startsWith("nsfw-")) || data.nsfw);

        if (data.permission_overwrites) {
            model.permissionOverwrites = new Collection<PermissionOverwrite>(PermissionOverwrite);
            data.permission_overwrites.forEach((overwrite) => {
                model.permissionOverwrites.add(overwrite);
            });
        }
    }
}
