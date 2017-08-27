import {Long} from "bson";
import UserPacket from "./UserPacket";
import OverwritePacket from "./OverwritePacket";

type ChannelPacket = {
    /**
     * the id of this channel
     */
    id: Long,

    /**
     * the type of the channel
     * @see https://discordapp.com/developers/docs/resources/channel#channel-object-channel-types
     */
    type: number,

    /**
     * the id of the guild
     */
    guild_id?: Long,

    /**
     * sorting position of the channel
     */
    position?: number,

    /**
     * explicit permission overwrites for members and roles
     */
    permission_overwrites?: OverwritePacket[],

    /**
     * the name of the channel (2-100 characters)
     */
    name?: string,

    /**
     * the channel topic (0-1024 characters)
     */
    topic?: string,

    /**
     * the id of the last message sent in this channel (may not point to an existing or valid message)
     */
    last_message_id?: Long,

    /**
     * the bitrate (in bits) of the voice channel
     */
    bitrate?: number,

    /**
     * the user limit of the voice channel
     */
    user_limit?: number,

    /**
     * the recipients of the DM
     */
    recipients?: UserPacket[],

    /**
     * icon hash
     */
    icon?: string,

    /**
     * id of the DM creator
     */
    owner_id?: Long,

    /**
     * application id of the group DM creator if it is bot-created
     */
    application_id?: Long,

    /**
     * whether the channel is marked as NSFW
     */
    nsfw?: boolean
};

export default ChannelPacket;