import ChannelPacket from "../../Gateway/Packet/ChannelPacket";
import Collection from "../../Helper/Collection";
import {ChannelType} from "../../Model/Channel";
import Message from "../../Model/Message";
import ModelInterface from "../../Model/ModelInterface";
import PrivateChannel from "../../Model/PrivateChannel";
import User from "../../Model/User";
import AbstractModelManager from "./AbstractModelManager";

export default class PrivateChannelManager extends AbstractModelManager<PrivateChannel> {
    public async initialize(model: PrivateChannel, data: ChannelPacket, parent: User | ModelInterface): Promise<void> {
        this.updateField(model, "id", data)
            .updateField(model, "type", data, null, (x) => x as ChannelType)
            .updateField(model, "user", parent, "id");

        model.messages = new Collection<Message>(Message, this.kernel.configuration.messageLimit);
    }
}
