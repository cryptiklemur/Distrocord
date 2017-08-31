import { Long } from "bson";
import GamePacket from "./GamePacket";
import UserPacket from "./UserPacket";
export declare type Status = "idle" | "dnd" | "online" | "offline";
interface PresencePacket {
    id: Long;
    /**
     * the user presence is being updated for
     */
    user?: UserPacket;
    /**
     * roles the user is in
     */
    roles?: Long[];
    /**
     * null, or the user's current activity
     */
    game?: GamePacket;
    /**
     * id of the guild
     */
    guild_id?: Long;
    /**
     * either "idle", "dnd", "online", or "offline"
     */
    status?: Status;
}
export default PresencePacket;
