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
@index('role.identifier')
@index('role.name')
@index('role.mentionable')
@index('role.hoisted')
@index('role.position')
@index("channel.createdAt")
@index("channel.identifier")
@index("channel.position")
@index("channel.nsfw")
@index('member.user')
@index('member.status')
@index('member.game')
@index('member.joinedAt')
@index('member.username')
@index('member.discriminator')
@index('member.createdAt')
@collection('guilds', Guild)
export default class GuildCollection extends AbstractCollection<Guild> {

}