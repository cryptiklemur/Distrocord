import {Long} from "bson";
import Cache from "../../Cache/Cache";

interface GuildInterface {
    /**
     * @type {Long|string} The ID of the user
     */
    identifier: Long;

    /**
     * @type {string} The name of the server
     */
    name: string;

    /**
     * @type {Long|string} The ID of the user that is the guild owner
     */
    ownerId: Long;

    /**
     * @type {Date|number} Timestamp of the guilds's creation
     */
    createdAt: Date;

    /**
     * @type {Date|number} Timestamp of when the bot account joined the guild
     */
    joinedAt: Date;

    /**
     * @type {number} The guild verification level
     */
    verificationLevel: number;

    /**
     * @type {string} The guild region
     */
    region: string;

    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    splash: string;

    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    icon: string;

    /**
     * @type {boolean} Whether the guild is unavailable or not
     */
    unavailable: boolean;

    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    large: boolean;

    /**
     * @type {number} Number of members in the guild
     */
    memberCount: number;

    readonly channels: Cache<any>;
    readonly members: Cache<any>;
    readonly roles: Cache<any>;
    readonly iconURL: string;
    readonly splashURL: string;

    fetchAllMembers();

    dynamicIconUrl(format, size): string;
}

export default GuildInterface;
