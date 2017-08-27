import AbstractCollection from "./AbstractCollection";
import Channel from "../Model/Channel";
import {collection, index} from "mongot";

@index('name')
@index('user')
@index('guild')
@index('createdAt')
@collection('channels', Channel)
export default class ChannelCollection extends AbstractCollection<Channel> {

}