import ChannelPacket from "../../Gateway/Packet/ChannelPacket";
import ModelInterface from "../../Model/ModelInterface";
import PrivateChannel from "../../Model/PrivateChannel";
import User from "../../Model/User";
import AbstractModelManager from "./AbstractModelManager";
export default class PrivateChannelManager extends AbstractModelManager<PrivateChannel> {
    initialize(model: PrivateChannel, data: ChannelPacket, parent: User | ModelInterface): Promise<void>;
}
