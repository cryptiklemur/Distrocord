import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";

/**
 * Event for GUILD_DELETE
 *
 * @prop data {GuildPacket}
 */
export default class GuildDeleteEvent extends AbstractEvent {
    protected get data(): GuildPacket {
        return super.data;
    }

    public async handle(): Promise<void> {
        if (this.data.unavailable) {
            this.emit("guildUnavailable", this.kernel.unavailableGuilds.add(this.data, this.kernel));

            return;
        }

        delete this.kernel.guildShardMap[this.data.id.toString()];
        const guild = await this.kernel.guilds.remove(this.data.id);
        if (guild !== undefined) { // Discord sends GUILD_DELETE for guilds that were previously unavailable in READY
            await guild.channels.forEach((channel) => delete this.kernel.channelGuildMap[channel.id.toString()], true);
        }

        this.emit("guildDelete", guild || this.data);
    }
}
