import GuildPacket from "../Gateway/Packet/GuildPacket";
import Channel, {ChannelModel} from "../Model/Channel";
import Guild from "../Model/Guild";
import Member, {MemberModel} from "../Model/Member";
import ModelInterface from "../Model/ModelInterface";
import Role, {RoleModel} from "../Model/Role";
import AbstractModelManager from "./AbstractModelManager";

export default class GuildManager extends AbstractModelManager<Guild> {
    public async initialize(model: Guild, data: GuildPacket, parent?: ModelInterface): Promise<void> {
        model.shard = this.kernel.shardHandler.get(this.kernel.guildShardMap[model.identifier]);

        this.updateField(model, "identifier", data, "id", (x) => x.toString())
            .updateField(model, "joinedAt", data, "joined_at")
            .updateField(model, "memberCount", data, "member_count");

        for (const x of model.roles) {

            const index = data.roles.findIndex((y) => y.id.toString() === x.identifier);
            if (index === -1) {
                this.kernel.emit("debug", `[Manager][Guild] Removing role: ${x.id}, no longer in guild.`);
                data.roles.splice(index, 1);
            }
        }

        for (const x of model.channels) {
            const index = data.channels.findIndex((y) => y.id.toString() === x.identifier);
            if (index === -1) {
                this.kernel.emit("debug", `[Manager][Guild] Removing channel: ${x.id}, no longer in guild.`);
                data.channels.splice(index, 1);
            }
        }
        for (const x of model.members) {
            const index = data.members.findIndex((y) => y.user.id.toString() === x.userId);
            if (index === -1) {
                this.kernel.emit("debug", `[Manager][Guild] Removing member: ${x.id}, no longer in guild.`);
                data.members.splice(index, 1);
            }
        }

        for (const d of data.roles) {
            const x = model.roles.find((x) => x.identifier === d.id.toString()) || new RoleModel(d);
            await this.kernel.modelManagers.role.doInitialize(x, d, model);

            if (!x.id) {
                await model.roles.push(x);
            }
        }

        for (const d of data.channels || []) {
            const x = model.channels.find((x) => x.identifier === d.id.toString()) || new ChannelModel(d);
            await this.kernel.modelManagers.channel.doInitialize(x, d, model);

            if (!x.id) {
                await model.channels.push(x);
            }
        }

        for (const d of data.members || []) {
            const x = model.members.find((x) => x.userId === d.user.id.toString()) || new MemberModel(d);
            await this.kernel.modelManagers.member.doInitialize(x, d, model);

            if (!x.id) {
                await model.members.push(x);
            }
        }

        for (const presence of data.presences || []) {
            const x: Member = model.members.find((y) => y.userId === presence.user.id.toString());
            if (!x) {
                continue;
            }

            await this.kernel.modelManagers.member.doUpdate(x, presence);
        }
    }

    public async update(model: Guild, data: GuildPacket): Promise<void> {
        this.updateField(model, "name", data)
            .updateField(model, "verificationLevel", data, "verification_level")
            .updateField(model, "splash", data)
            .updateField(model, "region", data)
            .updateField(model, "ownerId", data, "owner_id", (x) => x.toString())
            .updateField(model, "icon", data)
            .updateField(model, "large", data);
    }
}
