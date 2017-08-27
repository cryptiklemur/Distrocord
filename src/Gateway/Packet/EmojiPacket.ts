import {Long} from "bson";

type EmojiPacket = {
    /**
     * emoji id
     * @see https://discordapp.com/developers/docs/reference#image-formatting
     */
    id: Long,

    /**
     * emoji name
     */
    name: string,

    /**
     * Role ids this emoji is active for
     */
    roles: Long[],

    /**
     * whether this emoji must be wrapped in colons
     */
    require_colons: boolean,

    /**
     * whether this emoji is managed
     */
    managed: boolean
};

export default EmojiPacket;