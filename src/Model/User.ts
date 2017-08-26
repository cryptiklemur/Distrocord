import {instanceMethod, InstanceType, prop} from "typegoose";
import {CDN_URL} from "../Config/Endpoints";
import * as Constants from "../Config/Constants";
import Base from "./AbstractModel";



export type Status = "online" | "offline" | "idle" | "invisible";

export default class User extends Base {
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
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    @prop()
    public avatar?: string | null;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    @prop({index: true})
    public bot: boolean;

    @instanceMethod
    public get mention(this: InstanceType<User>): string {
        return `<@${this.id}>`;
    }

    @instanceMethod
    public get defaultAvatar(this: InstanceType<User>): string {
        return Constants.DefaultAvatarHashes[+this.discriminator % Constants.DefaultAvatarHashes.length];
    }

    @instanceMethod
    public get defaultAvatarURL(this: InstanceType<User>): string {
        return `https://discordapp.com/assets/${this.defaultAvatar}.png`;
    }

    @instanceMethod
    public get staticAvatarURL(this: InstanceType<User>): string {
        return this.avatar
            ? `${CDN_URL}/avatars/${this.id}/${this.avatar}.${this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
            : this.defaultAvatarURL;
    }

    @instanceMethod
    public get avatarURL(this: InstanceType<User>): string {
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
    @instanceMethod
    public dynamicAvatarUrl(this: InstanceType<User>, format: string, size: number): string {
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