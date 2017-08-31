import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";
/**
 * Event for GUILD_UPDATE
 *
 * @prop data {GuildPacket}
 */
export default class GuildUpdateEvent extends AbstractEvent {
    protected readonly data: GuildPacket;
    handle(): Promise<void>;
}
