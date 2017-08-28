import {document, prop} from "mongot";
import Collection from "../Helper/Collection";
import Kernel from "../Kernel";
import Channel, {ChannelType} from "./Channel";
import Message from "./Message";
import ModelInterface from "./ModelInterface";

@document
export default class PrivateChannel extends Channel implements ModelInterface {
    @prop
    public user: string;

    @prop
    public type: ChannelType = ChannelType.DM;

    public messages: Collection<Message>;
}
