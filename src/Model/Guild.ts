import {Long} from "bson";
import {instanceMethod, InstanceType, prop} from "typegoose";
import Shard from "../Gateway/Shard";
import Kernel from "../Kernel";
import ChannelManager from "../Manager/ChannelManager";
import MemberManager from "../Manager/MemberManager";
import RoleManager from "../Manager/RoleManager";
import AbstractModel from "./AbstractModel";
import Channel from "./Channel";
import Member from "./Member";
import Role from "./Role";

export default class Guild extends AbstractModel {
    /**
     * @type {string} The name of the server
     */
    @prop({required: true, index: true})
    public name: string;

    /**
     * @type {Long} The user that is the guild owner
     */
    @prop()
    public ownerId: Long;

    /**
     * @type {Date|number} Timestamp of when the bot account joined the guild
     */
    @prop({index: true})
    public joinedAt: number;

    /**
     * @type {number} The guild verification level
     */
    @prop()
    public verificationLevel: number;

    /**
     * @type {string} The guild region
     */
    @prop()
    public region: string;

    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    @prop()
    public splash: string;

    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    @prop()
    public icon: string;

    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    @prop({index: true})
    public large: boolean;

    /**
     * @type {boolean} Whether the guild is unavailable or not
     */
    public unavailable: boolean;

    public shard: Shard;

    /**
     * @type {number} Number of members in the guild
     */
    @prop()
    public memberCount: number;

    public roles: RoleManager;

    public members: MemberManager;

    public channels: ChannelManager;

    @instanceMethod
    public async initialize(this: InstanceType<Guild>, data: any, kernel: Kernel, parent?: AbstractModel) {
        this.identifier  = Long.fromString(data.id);
        this.shard       = kernel.shardHandler.get(kernel.guildShardMap[this.id]);
        this.unavailable = !!data.unavailable;
        this.joinedAt    = Date.parse(data.joined_at);
        this.memberCount = data.member_count;

        this.channels = new ChannelManager(kernel, Channel, this);
        this.members  = new MemberManager(kernel, Member, this);
        this.roles    = new RoleManager(kernel, Role, this);

        for (let role of data.roles) {
            await this.roles.add(role);
        }

        for (let channel of data.channels || []) {
            await this.channels.add(channel);
        }

        for (let member of data.members || []) {
            await this.members.add(member);
        }

        for (let presence of data.presences || []) {
            if (!this.members.get(presence.user.id)) {
                continue;
            }

            await this.members.update(Long.fromString(presence.user.id), presence);
        }

        await this.update(data, kernel);
    }

    public async update(this: InstanceType<Guild>, data: any, kernel: Kernel) {
        this.name              = data.name !== undefined ? data.name : this.name;
        this.verificationLevel = data.verification_level !== undefined ? data.verification_level : this.verificationLevel;
        this.splash            = data.splash !== undefined ? data.splash : this.splash;
        this.region            = data.region !== undefined ? data.region : this.region;
        this.ownerId           = data.owner_id !== undefined ? data.owner_id : this.ownerId;
        this.icon              = data.icon !== undefined ? data.icon : this.icon;
        this.large             = data.large !== undefined ? data.large : this.large;
    }
}

export const GuildModel = new Guild().getModelForClass(Guild);