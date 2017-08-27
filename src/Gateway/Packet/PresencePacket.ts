import {Long} from "bson";
import UserPacket from "./UserPacket";
import GamePacket from "./GamePacket";

export type Status = "idle" | "dnd" | "online" | "offline";

type PresencePacket = {
    id: Long,

    /**
     * the user presence is being updated for
     */
    user?: UserPacket,

    /**
     * roles the user is in
     */
    roles?: Long[],

    /**
     * null, or the user's current activity
     */
    game?: GamePacket,

    /**
     * id of the guild
     */
    guild_id?: Long,

    /**
     * either "idle", "dnd", "online", or "offline"
     */
    status?: Status
}

export default PresencePacket;