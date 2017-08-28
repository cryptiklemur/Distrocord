import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";

/**
 * Event for GUILD_UPDATE
 *
 * @prop data {GuildPacket}
 */
export default class GuildUpdateEvent extends AbstractEvent {
    protected get data(): GuildPacket {
        return super.data;
    }

    public async handle(): Promise<void> {
        const guild    = await this.kernel.guilds.get(this.data.id);
        const oldGuild = {
            name:              guild.name,
            verificationLevel: guild.verificationLevel,
            splash:            guild.splash,
            region:            guild.region,
            owner:             guild.owner,
            icon:              guild.icon,
        };

        this.emit("guildUpdate", this.kernel.guilds.upsert(this.data), oldGuild);
    }
}
