import { Long } from "bson";
import Channel from "./Channel";
import GuildChannel from "./GuildChannel";
import Member from "./Member";
import Role from "./Role";
import User from "./User";
export declare enum MessageType {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    GUILD_MEMBER_JOIN = 7,
}
export default class Message {
    id: Long;
    channel: Channel;
    timestamp: number;
    editedTimestamp: number;
    tts: boolean;
    attachments: any[];
    embeds: any[];
    reactions: any;
    type: MessageType;
    author: User;
    member?: Member;
    mentions: User[];
    content: string;
    roleMentions: Role[];
    channelMentions: GuildChannel[];
    readonly createdAt: Date;
}
