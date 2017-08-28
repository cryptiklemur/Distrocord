import {Long} from "bson";

interface UserPacket {
    /**
     * the user's id
     */
    id: Long;

    /**
     * the user's username, not unique across the platform
     */
    name: string;

    /**
     * the user's 4-digit discord-tag
     */
    discriminator: string;

    /**
     * the user's avatar hash
     * @see https://discordapp.com/developers/docs/reference#image-formatting
     */
    avatar: string;

    /**
     * whether the user belongs to an OAuth2 application
     */
    bot: boolean;

    /**
     * whether the user has two factor enabled on their account
     */
    mfa_enabled: boolean;

    /**
     * whether the email on this account has been verified
     */
    verified: boolean;

    /**
     * the user's email
     */
    email: string;
}

export default UserPacket;
