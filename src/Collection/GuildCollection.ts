import AbstractCollection from "./AbstractCollection";
import Guild from "../Model/Guild";
import {collection, index} from "mongot";

@index('name')
@index('owner')
@index('name')
@index('joinedAt')
@index('createdAt')
@index('region')
@index('large')
@index('memberCount')
@collection('guilds', Guild)
export default class GuildCollection extends AbstractCollection<Guild> {

}