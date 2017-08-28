import {SchemaFragmentArray} from "mongot";
import GuildPacket from "../../Gateway/Packet/GuildPacket";
import mergeById from "../../Helper/mergeById";
import Kernel from "../../Kernel";
import Guild from "../../Model/Guild";
import Member from "../../Model/Member";
import ModelInterface from "../../Model/ModelInterface";
import AbstractModelManager from "./AbstractModelManager";

export default class GuildManager extends AbstractModelManager<Guild> {
    public async initialize(model: Guild, data: GuildPacket, parent?: ModelInterface): Promise<void> {
        model.shard = this.kernel.shardHandler.get(this.kernel.guildShardMap[model.id]);

        this.updateField(model, "id", data, "id", (x) => x.toString())
            .updateField(model, "joinedAt", data, "joined_at")
            .updateField(model, "memberCount", data, "member_count");

        model.roles    = new SchemaFragmentArray(mergeById(model.roles, data.roles));
        model.channels = new SchemaFragmentArray(mergeById(model.channels, data.channels));
        model.members  = new SchemaFragmentArray(mergeById(model.members, data.members));

        for (const presence of data.presences || []) {
            const x: Member = model.members.find((y) => y.user === presence.user.id.toString());
            if (!x) {
                continue;
            }

            await this.kernel.modelManagers.member.doUpdate(x, presence);
        }

        Kernel.logger.debug("[Manager][Guild] Model: ", model);
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
