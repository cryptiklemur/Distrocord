import { Long } from "bson";
import { EventEmitter } from "eventemitter3";
import { LoggerInstance } from "winston";
import Configuration from "./Config/Configuration";
import RequestHandler from "./Handler/RequestHandler";
import ShardHandler from "./Handler/ShardHandler";
import Collection from "./Helper/Collection";
import Manager from "./Manager/Manager";
import AbstractModelManager from "./Manager/ModelManager/AbstractModelManager";
import Channel from "./Model/Channel";
import Guild from "./Model/Guild";
import ModelInterface from "./Model/ModelInterface";
import User, { UserStatus } from "./Model/User";
declare global  {
    interface String {
        equals(compare: string): boolean;
    }
}
export default class Kernel extends EventEmitter {
    static logger: LoggerInstance;
    configuration: Configuration;
    token: string;
    gatewayURL: string;
    requestHandler: RequestHandler;
    shardHandler: ShardHandler;
    presence: {
        game: any;
        status: UserStatus;
    };
    guildShardMap: {
        [id: string]: number;
    };
    channelGuildMap: {
        [id: string]: Long;
    };
    privateChannelMap: {
        [id: string]: Long;
    };
    unavailableGuilds: Collection<any>;
    modelManagers: {
        [name: string]: AbstractModelManager<ModelInterface>;
    };
    user: User;
    guilds: Manager<Guild>;
    users: Manager<User>;
    privateChannels: Manager<Channel>;
    private ready;
    private startTime;
    private lastConnect;
    private mongoConnected;
    readonly uptime: number;
    constructor(options: Configuration);
    /**
     * Get the Discord gateway URL
     * @returns {Promise<String>} Resolves with the gateway URL
     */
    getGateway(): Promise<any>;
    /**
     * Get the Discord gateway URL along with bot metadata
     * @returns {Promise<Object>} Resolves with the gateway data
     */
    getBotGateway(): Promise<any>;
    /**
     * Tells all shards to connect.
     * @returns {Promise} Resolves when all shards are initialized
     */
    connect(): Promise<{}>;
}
