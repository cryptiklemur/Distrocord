import {Long} from "bson";
import {prop, Typegoose} from "typegoose";
import Cache from "../Cache/Cache";
import {CDN_URL} from "../Config/Endpoints";
import Kernel from "../Kernel";
import * as Constants from "../Config/Constants";

export default class Guild extends Typegoose {
    private kernel: Kernel;

    /**
     * @type {Long|string} The ID of the user
     */
    @prop({required: true, index: true})
    public identifier: Long;

    /**
     * @type {string} The name of the server
     */
    @prop({required: true, index: true})
    public name: string;

    /**
     * @type {Long|string} The ID of the user that is the guild owner
     */
    @prop({required: true, index: true})
    public ownerId: Long;

    /**
     * @type {Date|number} Timestamp of the guilds's creation
     */
    @prop({index: true})
    public createdAt: Date;

    /**
     * @type {Date|number} Timestamp of when the bot account joined the guild
     */
    @prop({index: true})
    public joinedAt: Date;

    /**
     * @type {number} The guild verification level
     */
    @prop()
    public verificationLevel: number;

    /**
     * @type {string} The guild region
     */
    @prop()
    public region: string;

    /**
     * @type {string} The hash of the guild splash image, or null if no splash (VIP only)
     */
    @prop()
    public splash: string;

    /**
     * @type {string} The hash of the guild icon, or null if no icon
     */
    @prop()
    public icon: string;

    /**
     * @type {boolean} Whether the guild is unavailable or not
     */
    @prop({index: true})
    public unavailable: boolean;

    /**
     * @type {boolean} Whether the guild is "large" by "some Discord standard"
     */
    @prop({index: true})
    public large: boolean;

    /**
     * @type {number} Number of members in the guild
     */
    @prop()
    public memberCount: number;

    public get channels(): Cache<any> {
        return this.kernel.cacheRepository.get(`guild.${this.identifier}.channels`);
    }

    public get members(): Cache<any> {
        return this.kernel.cacheRepository.get(`guild.${this.identifier}.members`);
    }

    public get roles(): Cache<any> {
        return this.kernel.cacheRepository.get(`guild.${this.identifier}.roles`);
    }

    public get iconURL(): string | null {
        return this.icon
            ? `${CDN_URL}/icons/${this.identifier}/${this.icon}.${this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
            : null;
    }

    public get splashURL(): string | null {
        return this.splash ? `${CDN_URL}/splashes/${this.identifier}/${this.splash}.jpg` : null;
    }

    public fetchAllMembers() {
        //this.kernel.getGuildMembers(this.identifier, Math.ceil(this.memberCount / 1000));
    };

    /**
     * Get the guild's icon with the given format and size
     * @arg {String} [format] The filetype of the icon ("jpg", "png", "gif", or "webp")
     * @arg {Number} [size] The size of the icon (128, 256, 512, 1024, 2048)
     */
    public dynamicIconUrl(format: string, size: number): string {
        if (!format || !~Constants.ImageFormats.indexOf(format.toLowerCase())) {
            format = this.kernel.configuration.defaultImageFormat;
        }
        if (!size || !~Constants.ImageSizes.indexOf(size)) {
            size = this.kernel.configuration.defaultImageSize;
        }
        return this.icon ? `${CDN_URL}/icons/${this.identifier}/${this.icon}.${format}?size=${size}` : null;
    };
}

export const GuildModel = new Guild().getModelForClass(Guild);