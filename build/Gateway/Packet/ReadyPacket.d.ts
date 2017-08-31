import ChannelPacket from "./ChannelPacket";
import GuildPacket from "./GuildPacket";
import UserPacket from "./UserPacket";
interface ReadyPacket {
    /**
     * Gateway protocol version
     * @see https://discordapp.com/developers/docs/topics/gateway#gateway-protocol-versions
     */
    v: number;
    /**
     * information about the user including email
     */
    user: UserPacket;
    /**
     * the direct messages the user is in
     */
    private_channels: ChannelPacket[];
    /**
     * the guilds the user is in
     */
    guilds: GuildPacket[];
    /**
     * used for resuming connections
     */
    session_id: string;
    /**
     * used for debugging - the guilds the user is in
     */
    _trace: string[];
}
export default ReadyPacket;
