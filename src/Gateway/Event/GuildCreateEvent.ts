import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";

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
            this.kernel.unavailableGuilds.add(this.data, this.kernel);

            return;
        }

        const guild   = this.shard.createGuild(this.data);
        const removed = this.kernel.unavailableGuilds.remove(this.data);

        // If shard isn't ready, just remove from unavailable, and reset timeout
        if (!this.shard.ready) {
            this.shard.restartGuildCreateTimeout();

            return;
        }

        // Otherwise, see if we removed from unavailable. If we did, emit available, otherwise, created.
        if (removed) {
            this.emit("guildAvailable", guild);

            return;
        }

        this.emit("guildCreate", guild);
    }
}
