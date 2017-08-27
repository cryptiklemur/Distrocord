import {Long} from "bson";
import ChannelPacket from "./ChannelPacket";
import EmojiPacket from "./EmojiPacket";
import MemberPacket from "./MemberPacket";
import PresencePacket from "./PresencePacket";
import RolePacket from "./RolePacket";

export enum VerificationLevel {
    /**
     * unrestricted
     */
    NONE,


    /**
     * must have verified email on account
     */
    LOW,


    /**
     * must be registered on Discord for longer than 5 minutes
     */
    MEDIUM,


    /**
     * (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes
     */
    HIGH,


    /**
     * ┻━┻ミヽ(ಠ益ಠ)ﾉ彡┻━┻ - must have a verified phone number
     */
    VERY_HIGH
}

export enum DefaultMessageNotificationLevel {
    ALL_MESSAGES,
    ONLY_MENTIONS
}

export enum ExplicitContentFilterLevel {
    DISABLED,
    MEMBERS_WITHOUT_ROLES,
    ALL_MEMBERS
}

export enum MFALEVEL {
    NONE,
    ELEVATED
}

type GuildPacket = {
    /**
     * guild id
     */
    id: Long,

    /**
     * guild name (2-100 characters)
     */
    name: string,

    /**
     * icon hash
     * @see https://discordapp.com/developers/docs/reference#image-formatting
     */
    icon: string,

    /**
     * splash hash
     * @see https://discordapp.com/developers/docs/reference#image-formatting
     */
    splash: string,

    /**
     * id of owner
     */
    owner_id: Long,

    /**
     * voice region id
     */
    region: string,

    /**
     * id of afk channel
     */
    afk_channel_id: Long,

    /**
     * afk timeout in seconds
     */
    afk_timeout: number,

    /**
     * is this guild embeddable (e.g. widget)
     */
    embed_enabled: boolean,

    /**
     * id of embedded channel
     */
    embed_channel_id: Long,

    /**
     * level of verification required for the guild
     * @see https://discordapp.com/developers/docs/resources/guild#guild-object-verification-level
     */
    verification_level: VerificationLevel,

    /**
     * default message notifications level
     * @see https://discordapp.com/developers/docs/resources/guild#guild-object-default-message-notification-level
     */
    default_message_notifications: DefaultMessageNotificationLevel,

    /**
     * default explicit content filter level
     * @see https://discordapp.com/developers/docs/resources/guild#guild-object-explicit-content-filter-level
     */
    explicit_content_filter: ExplicitContentFilterLevel,

    /**
     * roles in the guild
     */
    roles: RolePacket[],

    /**
     * custom guild emojis
     */
    emojis: EmojiPacket[],

    /**
     * enabled guild features
     */
    features: string[],

    /**
     * required MFA level for the guild
     * @see https://discordapp.com/developers/docs/resources/guild#guild-object-mfa-level
     */
    mfa_level: MFALEVEL,

    /**
     * application id of the guild creator if it is bot-created
     */
    application_id?: Long,

    /**
     * whether or not the server widget is enabled
     */
    widget_enabled: boolean,

    /**
     * the channel id for the server widget
     */
    widget_channel_id: Long,

    /**
     * when this guild was joined at
     */
    joined_at: Date,

    /**
     * whether this is considered a large guild
     */
    large: boolean,

    /**
     * is this guild unavailable
     */
    unavailable: boolean,

    /**
     * total number of members in this guild
     */
    member_count: number,

    /**
     * (without the `guild_id` key
     */
    voice_states: Array<any>,

    /**
     * users in the guild
     */
    members: MemberPacket[],

    /**
     * channels in the guild
     */
    channels: ChannelPacket[],

    /**
     * presences of the users in the guild
     */
    presences: PresencePacket[]
}

export default GuildPacket;