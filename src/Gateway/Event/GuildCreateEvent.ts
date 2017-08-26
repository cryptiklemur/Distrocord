import AbstractEvent from "./AbstractEvent";
import GuildPacket from "../Packet/GuildPacket";

/**
 * Event for GUILD_CREATE
 *
 * @prop data {GuildPacket}
 */
export default class GuildCreateEvent extends AbstractEvent {
    protected get data(): GuildPacket {
        return super.data;
    }

    public async handle(): Promise<void> {
        if (this.data.unavailable) {
            await this.kernel.guilds.remove(this.data.id);
            this.kernel.emit('unavailableGuildCreate', this.kernel.unavailableGuilds.add(this.data, this.kernel));

            return;
        }


        // If shard isn't ready, just remove from unavailable, and reset timeout
        let removed = this.kernel.unavailableGuilds.remove(this.data);
        if (!this.shard.ready) {
            this.shard.restartGuildCreateTimeout();

            return;
        }

        // Otherwise, see if we removed from unavailable. If we did, emit available, otherwise, created.
        let guild = this.shard.createGuild(this.data);
        if (removed) {
            this.kernel.emit("guildAvailable", guild);

            return;
        }

        this.kernel.emit("guildCreate", guild);
    }
}
