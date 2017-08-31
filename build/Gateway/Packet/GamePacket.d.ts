export declare enum GameType {
    /**
     * Playing {name}
     */
    GAME = 0,
    /**
     * Streaming {name}
     */
    STREAMING = 1,
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
