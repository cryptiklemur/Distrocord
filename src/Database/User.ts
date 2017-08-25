import {Long} from "bson";
import {prop, Typegoose} from "typegoose";
import {CDN_URL} from "../Config/Endpoints";
import Kernel from "../Kernel";
import * as Constants from "../Config/Constants";
import Status from "./Status";

export default class User extends Typegoose {
    private kernel: Kernel;

    /**
     * @type {Long|string} The ID of the user
     */
    @prop({required: true, index: true})
    public identifier: Long;

    /**
     * @type {string} The username of the user
     */
    @prop({required: true, index: true})
    public username: string;

    /**
     * @type {string} The discriminator of the user
     */
    @prop({required: true, index: true})
    public discriminator: string;

    /**
     * @type {Status} Online status of the user
     */
    @prop({index: true})
    public status: Status;

    /**
     * @type {string|null} Game the user is playing
     */
    @prop()
    public game?: string | null;

    /**
     * @type {Date|number} Timestamp of the user's creation
     */
    @prop({index: true})
    public createdAt: Date;

    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    @prop()
    public avatar?: string | null;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    @prop({index: true})
    public bot: boolean;

    public get mention(): string {
        return `<@${this.id}>`;
    }

    public get defaultAvatar(): string {
        return Constants.DefaultAvatarHashes[+this.discriminator % Constants.DefaultAvatarHashes.length];
    }

    public get defaultAvatarURL(): string {
        return `https://discordapp.com/assets/${this.defaultAvatar}.png`;
    }

    public get staticAvatarURL(): string {
        return this.avatar
            ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
            : this.defaultAvatarURL;
    }

    public get avatarURL(): string {
        return this.avatar
            ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${this.avatar.startsWith("a_")
                ? "gif"
                : this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
            : this.defaultAvatarURL;
    }

    /**
     * Get the user's avatar with the given format and size
     *
     * @arg {String} [format] The filetype of the icon ("jpg", "png", "gif", or "webp")
     * @arg {Number} [size] The size of the icon (128, 256, 512, 1024, 2048)
     */
    public dynamicAvatarUrl(format: string, size: number): string {
        if (!format || !~Constants.ImageFormats.indexOf(format.toLowerCase())) {
            format = this.kernel.configuration.defaultImageFormat;
        }
        if (!size || !~Constants.ImageSizes.indexOf(size)) {
            size = this.kernel.configuration.defaultImageSize;
        }
        return this.avatar ? `${CDN_URL}/avatar/${this.identifier}/${this.avatar}.${format}?size=${size}` : null;
    };
}

export const UserModel = new User().getModelForClass(User);