import AbstractCollection from "./AbstractCollection";
import {collection, index} from "mongot";
import PrivateChannel from "../Model/PrivateChannel";

@index("name")
@index("user")
@index("createdAt")
@collection("channels", PrivateChannel)
export default class ChannelCollection extends AbstractCollection<PrivateChannel> {

}