import {Long} from "bson";
import {Type} from "../../Model/PermissionOverwrite";

type OverwritePacket = {
    /**
     * the user or role id
     */
    id: Long,

    /**
     * either "role" or "member"
     */
    type: Type,

    /**
     * permission bit set of allowed permissions
     */
    allow: number,

    /**
     * permission bit set of denied permissions
     */
    deny: number
};

export default OverwritePacket;