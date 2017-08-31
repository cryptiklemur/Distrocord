import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";
/**
 * Event for GUILD_DELETE
 *
 * @prop data {GuildPacket}
 */
export default class GuildDeleteEvent extends AbstractEvent {
    protected readonly data: GuildPacket;
    handle(): Promise<void>;
}
