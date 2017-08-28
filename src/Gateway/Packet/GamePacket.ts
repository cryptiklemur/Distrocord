export enum GameType {
    /**
     * Playing {name}
     */
    GAME,

    /**
     * Streaming {name}
     */
    STREAMING,
}

interface GamePacket {
    /**
     * the game's name
     */
    name: string;

    /**
     * Game type
     * @see https://discordapp.com/developers/docs/topics/gateway#game-object-game-types
     */
    type: GameType;

    url?: string;
}

export default GamePacket;
