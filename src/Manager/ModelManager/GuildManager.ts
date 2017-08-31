import {SchemaFragment, SchemaFragmentArray} from "mongot";
import * as util from "util";
import GuildPacket from "../../Gateway/Packet/GuildPacket";
import RolePacket from "../../Gateway/Packet/RolePacket";
import Channel from "../../Model/Channel";
import Guild from "../../Model/Guild";
import GuildChannel from "../../Model/GuildChannel";
import Member from "../../Model/Member";
import ModelInterface from "../../Model/ModelInterface";
import Role from "../../Model/Role";
import AbstractModelManager from "./AbstractModelManager";

export default class GuildManager extends AbstractModelManager<Guild> {
    public async initialize(model: Guild, data: GuildPacket, parent?: ModelInterface): Promise<void> {
        model.shard = this.kernel.shardHandler.get(this.kernel.guildShardMap[model.id.toString()]);

        this.updateField(model, "id", data)
            .updateField(model, "joinedAt", data, "joined_at")
            .updateField(model, "memberCount", data, "member_count");

        model.roles = await this.getSubDocument<Role>(model, data.roles, this.kernel.modelManagers.role);
        model.channels = await this.getSubDocument<GuildChannel>(
            model,
            data.channels,
            this.kernel.modelManagers.guildChannel,
        );
        model.members = await this.getSubDocument<Member>(model, data.members, this.kernel.modelManagers.member);

        for (const presence of data.presences || []) {
            const x: Member = model.members.find((y) => y.id === presence.user.id);
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
            .updateField(model, "owner", data, "owner_id", (x) => x.toString())
            .updateField(model, "icon", data)
            .updateField(model, "large", data);
    }
}
