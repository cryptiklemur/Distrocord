import AbstractEvent from "./AbstractEvent";
import GuildPacket from "../Packet/GuildPacket";

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
        let guild = await this.kernel.guilds.get(this.data.id);
        let oldGUild = {
            name: guild.name,
            
        }
    }
}
