import { EventEmitter } from "eventemitter3";
import Kernel from "../Kernel";
import Guild from "../Model/Guild";
export default class Shard extends EventEmitter {
    id: number;
    private kernel;
    status: string;
    ready: boolean;
    discordServerTrace: any;
    sessionID: any;
    reconnectInterval: number;
    preReady: boolean;
    connectAttempts: number;
    connecting: boolean;
    private heartbeatInterval;
    private lastHeartbeatSent;
    private lastHeartbeatReceived;
    private ws;
    private unsyncedGuilds;
    private lastHeartbeatAck;
    private guildSyncQueueLength;
    private guildSyncQueue;
    private getAllUsersLength;
    private getAllUsersQueue;
    private getAllUsersCount;
    private seq;
    private guildCreateTimeout;
    private idleSince?;
    private globalBucket;
    private presenceUpdateBucket;
    private presence;
    private _rPackets;
    private _rStartTime;
    readonly latency: number;
    constructor(id: number, kernel: Kernel);
    /**
     * Tells the shard to connect
     */
    connect(): void;
    /**
     * Disconnects the shard
     * @arg {Object?} [options] Shard disconnect options
     * @arg {String | Boolean} [options.reconnect] false means destroy everything, true means you want to reconnect in
     *     the future, "auto" will autoreconnect
     */
    disconnect(options: {
        reconnect: boolean | string;
    }, error?: any): void;
    createGuild(_guild: any): Promise<Guild>;
    checkReady(): void;
    initializeWS(): void;
    parse(message: any): any;
    heartbeat(normal?: boolean): void;
    sendWS(op: any, _data: any): void;
    /**
     * Updates the bot's status on all guilds the shard is in
     * @arg {String} [status] Sets the bot's status, either "online", "idle", "dnd", or "invisible"
     * @arg {Object} [game] Sets the bot's active game, null to clear
     * @arg {String} game.name Sets the name of the bot's active game
     * @arg {Number} [game.type] The type of game. 0 is default, 1 is streaming (Twitch only)
     * @arg {String} [game.url] Sets the url of the shard's active game
     */
    editStatus(status: any, game: any): void;
    sendStatusUpdate(): void;
    restartGuildCreateTimeout(): void;
    private getGuildMembers(guildID, chunkCount);
    private requestGuildMembers(guildID, query?, limit?);
    private reset();
    private hardReset();
    private wsEvent(packet);
    private getClassFromType(type);
    private castFields(data, key?, depth?);
    private resume();
    private identify();
    private syncGuild(guildID);
    private requestGuildSync(guildID);
}
