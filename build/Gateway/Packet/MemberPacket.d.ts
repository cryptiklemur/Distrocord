import { Long } from "bson";
import UserPacket from "./UserPacket";
interface MemberPacket {
    /**
     * user object
     */
    user: UserPacket;
    /**
     * this user's guild nickname (if one is set)
     */
    nick?: string;
    /**
     * array of role object ids
     */
    roles: Long[];
    /**
     * when the user joined the guild
     */
    joined_at: Date;
    /**
     * if the user is deafened
     */
    deaf: boolean;
    /**
     * if the user is muted
     */
    mute: boolean;
}
export default MemberPacket;
