import {Long} from "bson";
import * as mongoose from "mongoose";
import Cache from "../../Cache/Cache";
import * as Constants from "../../Config/Constants";
import {CDN_URL} from "../../Config/Endpoints";

const schema = new mongoose.Schema(
    {
        /**
         * @type {Long|String} The ID of the user
         */
        identifier: Long,

        /**
         * @type {String} The name of the server
         */
        name: String,

        /**
         * @type {Long|String} The ID of the user that is the guild owner
         */
        ownerId: Long,

        /**
         * @type {Date|Number} Timestamp of the guilds's creation
         */
        createdAt: Date,

        /**
         * @type {Date|Number} Timestamp of when the bot account joined the guild
         */
        joinedAt: Date,

        /**
         * @type {Number} The guild verification level
         */
        verificationLevel: Number,

        /**
         * @type {String} The guild region
         */
        region: String,

        /**
         * @type {String} The hash of the guild splash image, or null if no splash (VIP
         *     only)
         */
        splash: String,

        /**
         * @type {String} The hash of the guild icon, or null if no icon
         */
        icon: String,

        /**
         * @type {boolean} Whether the guild is unavailable or not
         */
        unavailable: Boolean,

        /**
         * @type {boolean} Whether the guild is "large" by "some Discord standard"
         */
        large: Boolean,

        /**
         * @type {Number} Number of members in the guild
         */
        memberCount: Number,
    }
);

/* Getters */
schema.virtual("channels").get(function (): Cache<any> {
    return this.kernel.cacheRepository.get(`guild.${this.identifier}.channels`);
});

schema.virtual("members").get(function (): Cache<any> {
    return this.kernel.cacheRepository.get(`guild.${this.identifier}.members`);
});

schema.virtual("roles").get(function (): Cache<any> {
    return this.kernel.cacheRepository.get(`guild.${this.identifier}.roles`);
});

schema.virtual("iconURL").get(function (): string | null {
    return this.icon
        ? `${CDN_URL}/icons/${this.identifier}/${this.icon}.${this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
        : null;
});

schema.virtual("splashURL").get(function (): string | null {
    return this.splash ? `${CDN_URL}/splashes/${this.identifier}/${this.splash}.jpg` : null;
});

/* Public Methods */
schema.methods.fetchAllMembers = function () {
    //this.kernel.getGuildMembers(this.identifier, Math.ceil(this.memberCount / 1000));
};

/**
 * Get the guild's icon with the given format and size
 * @arg {String} [format] The filetype of the icon ("jpg", "png", "gif", or "webp")
 * @arg {Number} [size] The size of the icon (128, 256, 512, 1024, 2048)
 */
schema.methods.dynamicIconUrl = function (format: string, size: number): string {
    if (!format || !~Constants.ImageFormats.indexOf(format.toLowerCase())) {
        format = this.kernel.configuration.defaultImageFormat;
    }
    if (!size || !~Constants.ImageSizes.indexOf(size)) {
        size = this.kernel.configuration.defaultImageSize;
    }
    return this.icon ? `${CDN_URL}/icons/${this.identifier}/${this.icon}.${format}?size=${size}` : null;
};

export default schema;