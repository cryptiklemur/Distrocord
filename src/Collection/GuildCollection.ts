import {collection, index} from "mongot";
import Guild from "../Model/Guild";
import AbstractCollection from "./AbstractCollection";

@index("name")
@index("owner")
@index("name")
@index("joinedAt")
@index("createdAt")
@index("region")
@index("large")
@index("memberCount")
@index("roles.id")
@index("roles.name")
@index("roles.mentionable")
@index("roles.hoisted")
@index("roles.position")
@index("channels.createdAt")
@index("channels.id")
@index("channels.position")
@index("channels.nsfw")
@index("members.user")
@index("members.status")
@index("members.game")
@index("members.joinedAt")
@index("members.username")
@index("members.discriminator")
@index("members.createdAt")
@collection("guilds", Guild)
export default class GuildCollection extends AbstractCollection<Guild> {

}
