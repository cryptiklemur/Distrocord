import {Long} from "bson";
import {document, prop, SchemaDocument, SchemaFragmentArray} from "mongot";
import Shard from "../Gateway/Shard";
import Kernel from "../Kernel";
import DocumentInterface from "./DocumentInterface";
import GuildChannel from "./GuildChannel";
import Member from "./Member";
import Role from "./Role";

@document
export default class Guild extends SchemaDocument implements DocumentInterface {
    @prop
    public id: Long;

    /**
     * @type {string} The name of the server
     */
    @prop
    public name: string;

    /**
     * @type {string} The user that is the guild owner
     */
    @prop
    public owner: Long;

    /**
     * @type {Date} Timestamp of when the bot account joined the guild
     */
    @prop
    public joinedAt: Date;

    /**
     * @type {number} The guild verification level
     */
    @prop
    public verificationLevel: number;

    /**
     * @type {string} The guild region
     */
    @prop
    public region: string;

    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    @prop
    public splash?: string;

    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    @prop
    public icon?: string;

    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    @prop
    public large: boolean;

    /**
     * @type {number} Number of members in the guild
     */
    @prop
    public memberCount: number;

    @prop(Role)
    public roles: SchemaFragmentArray<Role>;

    @prop(Member)
    public members: SchemaFragmentArray<Member>;

    @prop(GuildChannel)
    public channels: SchemaFragmentArray<GuildChannel>;

    @prop
    public shard: Shard;

    public kernel: Kernel;

    public get createdAt(): Date {
        return new Date(+this.id.div(Long.fromNumber(4194304)).add(Long.fromNumber(1420070400000)).toString());
    }
}
