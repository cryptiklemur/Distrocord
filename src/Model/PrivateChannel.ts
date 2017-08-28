import {document, prop} from "mongot";
import Collection from "../Helper/Collection";
import Channel, {ChannelType} from "./Channel";
import DocumentInterface from "./DocumentInterface";
import Message from "./Message";

@document
export default class PrivateChannel extends Channel implements DocumentInterface {
    @prop
    public user: string;

    @prop
    public type: ChannelType = ChannelType.DM;

    public messages: Collection<Message>;
}
