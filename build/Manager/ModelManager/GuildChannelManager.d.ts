import ChannelPacket from "../../Gateway/Packet/ChannelPacket";
import Guild from "../../Model/Guild";
import GuildChannel from "../../Model/GuildChannel";
import ModelInterface from "../../Model/ModelInterface";
import AbstractModelManager from "./AbstractModelManager";
export default class GuildChannelManager extends AbstractModelManager<GuildChannel> {
    initialize(model: GuildChannel, data: ChannelPacket, parent: Guild | ModelInterface): Promise<void>;
    update(model: GuildChannel, data: ChannelPacket): Promise<void>;
}
