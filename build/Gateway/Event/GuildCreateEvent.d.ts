import GuildPacket from "../Packet/GuildPacket";
import AbstractEvent from "./AbstractEvent";
/**
 * Event for GUILD_CREATE
 *
 * @prop data {GuildPacket}
 */
export default class GuildCreateEvent extends AbstractEvent {
    protected readonly data: GuildPacket;
    handle(): Promise<void>;
}
