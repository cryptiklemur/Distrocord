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
         * @type {String} The hash of the guild splash image, or null if no splash (VIP only)
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
    },
);

/* Getters */

/**
 * A string that mentions the user
 *
 * @returns {string}
 */
schema.virtual('mention').get(function() {
    return "<@" + this.identifier + ">";
});

/**
 * The hash for the default avatar of a user if there is no avatar set
 *
 * @returns {string}
 */
schema.virtual('defaultAvatar').get(function() {
    return Constants.DefaultAvatarHashes[+this.discriminator % Constants.DefaultAvatarHashes.length];
});

/**
 * The URL of the user's default avatar
 *
 * @returns {string}
 */
schema.virtual('defaultAvatarURL').get(function() {
    return `https://discordapp.com/assets/${this.defaultAvatar}.png`;
});

/**
 * The URL of the user's avatar (always a JPG)
 *
 * @returns {string}
 */
schema.virtual('staticAvatarURL').get(function() {
    return this.avatar
        ? `${CDN_URL}/avatars/${this.identifier}/${this.avatar}.${this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
        : this.defaultAvatarURL;
});

/**
 * The URL of the user's avatar which can be either a JPG or GIF
 *
 * @returns {string}
 */
schema.virtual('avatarURL').get(function() {
    return this.avatar
        ? `${CDN_URL}/avatars/${this.identifier}/${this.avatar}.${this.avatar.startsWith("a_")
            ? "gif"
            : this.kernel.configuration.defaultImageFormat}?size=${this.kernel.configuration.defaultImageSize}`
        : this.defaultAvatarURL;
});

/**
 * Get the user's avatar with the given format and size
 * @arg {String} [format] The filetype of the avatar ("jpg", "png", "gif", or "webp")
 * @arg {Number} [size] The size of the avatar (128, 256, 512, 1024, 2048)
 */
schema.methods.dynamicIconUrl = function (format: string, size: number): string {
    if (!format || !~Constants.ImageFormats.indexOf(format.toLowerCase())) {
        format = this.kernel.configuration.defaultImageFormat;
    }
    if (!size || !~Constants.ImageSizes.indexOf(size)) {
        size = this.kernel.configuration.defaultImageSize;
    }
    return this.icon ? `${CDN_URL}/avatars/${this.identifier}/${this.icon}.${format}?size=${size}` : null;
};

export default schema;