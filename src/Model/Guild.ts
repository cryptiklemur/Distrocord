import {instanceMethod, InstanceType, prop} from "typegoose";
import GuildPacket from "../Gateway/Packet/GuildPacket";
import Shard from "../Gateway/Shard";
import Kernel from "../Kernel";
import Manager from "../Manager/Manager";
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
     * @type {string} The user that is the guild owner
     */
    @prop({required: true})
    public ownerId: string;

    /**
     * @type {Date} Timestamp of when the bot account joined the guild
     */
    @prop({index: true, required: true})
    public joinedAt: Date;

    /**
     * @type {number} The guild verification level
     */
    @prop({required: true})
    public verificationLevel: number;

    /**
     * @type {string} The guild region
     */
    @prop({required: true})
    public region: string;

    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    @prop({required: true})
    public splash: string;

    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    @prop({required: true})
    public icon: string;

    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    @prop({index: true, required: true})
    public large: boolean;

    public shard: Shard;

    /**
     * @type {number} Number of members in the guild
     */
    @prop({required: true})
    public memberCount: number;

    public roles: Manager<Role>;

    public members: Manager<Member>;

    public channels: Manager<Channel>;

    @instanceMethod
    public async initialize(this: InstanceType<Guild>, data: GuildPacket, kernel: Kernel, parent?: AbstractModel) {
        this.identifier  = data.id.toString();
        this.shard       = kernel.shardHandler.get(kernel.guildShardMap[this.id]);
        this.joinedAt    = data.joined_at;
        this.memberCount = data.member_count;

        this.roles    = new Manager<Role>(kernel, Role, this);
        this.members  = new Manager<Member>(kernel, Member, this);
        this.channels = new Manager<Channel>(kernel, Channel, this);

        for (const role of data.roles) {
            await this.roles.add(role);
        }

        for (const channel of data.channels || []) {
            await this.channels.add(channel);
        }

        for (const member of data.members || []) {
            await this.members.add(member);
        }

        for (const presence of data.presences || []) {
            if (!this.members.get(presence.user.id)) {
                continue;
            }

            await this.members.update(presence.user.id, presence);
        }

        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<Guild>, data: any, kernel: Kernel) {
        this.name              = data.name !== undefined ? data.name : this.name;
        this.verificationLevel =
            data.verification_level !== undefined ? data.verification_level : this.verificationLevel;
        this.splash            = data.splash !== undefined ? data.splash : this.splash;
        this.region            = data.region !== undefined ? data.region : this.region;
        this.ownerId           = data.owner_id !== undefined ? data.owner_id : this.ownerId;
        this.icon              = data.icon !== undefined ? data.icon : this.icon;
        this.large             = data.large !== undefined ? data.large : this.large;
    }
}

export const GuildModel = new Guild().getModelForClass(Guild);
