import {Long} from "bson";
import Status from "../Status";

interface UserInterface {
    /**
     * @type {Long|string} The ID of the user
     */
    identifier: Long;

    /**
     * @type {string} The username of the user
     */
    username: string;

    /**
     * @type {Status} Online status of the user
     */
    status: Status;

    /**
     * @type {string|null} Game the user is playing
     */
    game?: string | null;

    /**
     * @type {Date|number} Timestamp of the user's creation
     */
    createdAt: Date;

    /**
     * @type {string} The discriminator of the user
     */
    discriminator: string;

    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    avatar?: string | null;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    bot: boolean;

    readonly mention: string;
    readonly defaultAvatar: string;
    readonly defaultAvatarURL: string;
    readonly staticAvatarURL: string;
    readonly avatarURL: string;

    dynamicAvatarURL(format: string, size: number): string;
}

export default UserInterface;
