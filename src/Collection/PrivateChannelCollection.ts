import {collection, index} from "mongot";
import PrivateChannel from "../Model/PrivateChannel";
import AbstractCollection from "./AbstractCollection";

@index("name")
@index("user")
@index("createdAt")
@collection("channels", PrivateChannel)
export default class PrivateChannelCollection extends AbstractCollection<PrivateChannel> {

}
