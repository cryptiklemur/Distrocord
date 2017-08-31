import { Long } from "bson";
import { SchemaDocument, SchemaFragmentArray } from "mongot";
import Shard from "../Gateway/Shard";
import Kernel from "../Kernel";
import DocumentInterface from "./DocumentInterface";
import GuildChannel from "./GuildChannel";
import Member from "./Member";
import Role from "./Role";
export default class Guild extends SchemaDocument implements DocumentInterface {
    id: Long;
    /**
     * @type {string} The name of the server
     */
    name: string;
    /**
     * @type {string} The user that is the guild owner
     */
    owner: Long;
    /**
     * @type {Date} Timestamp of when the bot account joined the guild
     */
    joinedAt: Date;
    /**
     * @type {number} The guild verification level
     */
    verificationLevel: number;
    /**
     * @type {string} The guild region
     */
    region: string;
    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    splash?: string;
    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    icon?: string;
    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    large: boolean;
    /**
     * @type {number} Number of members in the guild
     */
    memberCount: number;
    roles: SchemaFragmentArray<Role>;
    members: SchemaFragmentArray<Member>;
    channels: SchemaFragmentArray<GuildChannel>;
    shard: Shard;
    kernel: Kernel;
    readonly createdAt: Date;
}
