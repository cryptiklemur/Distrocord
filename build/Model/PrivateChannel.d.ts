import { Long } from "bson";
import Collection from "../Helper/Collection";
import Channel, { ChannelType } from "./Channel";
import DocumentInterface from "./DocumentInterface";
import Message from "./Message";
export default class PrivateChannel extends Channel implements DocumentInterface {
    user: Long;
    type: ChannelType;
    messages: Collection<Message>;
}
