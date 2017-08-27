import {Long} from "bson";

type RolePacket = {
    /**
     * role id
     */
    id: Long,

    /**
     * role Name
     */
    name: string,

    /**
     * integer representation of hexadecimal color code
     */
    color: number,

    /**
     * if this role is pinned in the user listing
     */
    hoist: boolean,

    /**
     * position of this role
     */
    position: number,

    /**
     * permission bit set
     */
    permissions: number;

    /**
     * whether this role is managed by an integration
     */
    managed: boolean,

    /**
     * whether this role is mentionable
     */
    mentionable: boolean
};

export default RolePacket;