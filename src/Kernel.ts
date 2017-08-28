import {Long} from "bson";
import {EventEmitter} from "eventemitter3";
import * as mongoose from "mongoose";
import {Repository} from "mongot";
import * as winston from "winston";
import {LoggerInstance} from "winston";
import GuildCollection from "./Collection/GuildCollection";
import PrivateChannelCollection from "./Collection/PrivateChannelCollection";
import UserCollection from "./Collection/UserCollection";
import Configuration from "./Config/Configuration";
import * as Constants from "./Config/Constants";
import * as Endpoints from "./Config/Endpoints";
import RequestHandler from "./Handler/RequestHandler";
import ShardHandler from "./Handler/ShardHandler";
import Collection from "./Helper/Collection";
import Manager from "./Manager/Manager";
import AbstractModelManager from "./Manager/ModelManager/AbstractModelManager";
import GuildChannelManager from "./Manager/ModelManager/GuildChannelManager";
import GuildManager from "./Manager/ModelManager/GuildManager";
import MemberManager from "./Manager/ModelManager/MemberManager";
import PermissionManager from "./Manager/ModelManager/PermissionManager";
import PermissionOverwriteManager from "./Manager/ModelManager/PermissionOverwriteManager";
import PrivateChannelManager from "./Manager/ModelManager/PrivateChannelManager";
import RoleManager from "./Manager/ModelManager/RoleManager";
import UserManager from "./Manager/ModelManager/UserManager";
import Channel from "./Model/Channel";
import Guild from "./Model/Guild";
import ModelInterface from "./Model/ModelInterface";
import User, {Status} from "./Model/User";

// Set global promises
(mongoose as any).Promise = global.Promise;
// require('mongoose-long')(mongoose);

declare global {
    interface String {
        equals(compare: string): boolean;
    }
}

String.prototype.equals = function(this: string, compare: string): boolean {
    return this === compare;
};

export default class Kernel extends EventEmitter {
    public static logger: LoggerInstance;

    public configuration: Configuration;
    public token: string;
    public gatewayURL: string;
    public requestHandler: RequestHandler;
    public shardHandler: ShardHandler;
    public presence: { game: any; status: Status };
    public guildShardMap: { [id: string]: number }                                 = {};
    public channelGuildMap: { [id: string]: Long }                                 = {};
    public privateChannelMap: { [id: string]: Long }                               = {};
    public unavailableGuilds: Collection<any>;
    public modelManagers: { [name: string]: AbstractModelManager<ModelInterface> } = {};

    public user: User;
    public guilds: Manager<Guild>;
    public users: Manager<User>;
    public privateChannels: Manager<Channel>;

    private ready: boolean;
    private startTime: number       = 0;
    private lastConnect: number     = 0;
    private mongoConnected: boolean = false;

    get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    constructor(options: Configuration) {
        super();

        this.configuration = new Configuration(options);
        this.token         = this.configuration.token;
        this.ready         = false;

        if (!~Constants.ImageFormats.indexOf(this.configuration.defaultImageFormat.toLowerCase())) {
            this.configuration.defaultImageFormat = "jpg";
        }
        if (!~Constants.ImageSizes.indexOf(this.configuration.defaultImageSize)) {
            this.configuration.defaultImageSize = 128;
        }

        Kernel.logger = new (winston.Logger)(
            {
                level:      this.configuration.logLevel,
                transports: [
                    new (winston.transports.Console)(
                        {
                            colorize:  true,
                            timestamp: true,
                        },
                    ),
                ],
            },
        );

        this.requestHandler    = new RequestHandler(this);
        this.shardHandler      = new ShardHandler(this);
        this.unavailableGuilds = new Collection<Guild>(Guild);

        this.modelManagers.member              = new MemberManager(this);
        this.modelManagers.privateChannel      = new PrivateChannelManager(this);
        this.modelManagers.guildChannel        = new GuildChannelManager(this);
        this.modelManagers.guild               = new GuildManager(this);
        this.modelManagers.permission          = new PermissionManager(this);
        this.modelManagers.permissionOverwrite = new PermissionOverwriteManager(this);
        this.modelManagers.role                = new RoleManager(this);
        this.modelManagers.user                = new UserManager(this);

        this.guilds          = new Manager<Guild>(
            this,
            new Repository(this.configuration.mongo.guildDatabase).get(GuildCollection),
            this.modelManagers.guild,
        );
        this.users           = new Manager<User>(
            this,
            new Repository(this.configuration.mongo.userDatabase).get(UserCollection),
            this.modelManagers.user,
        );
        this.privateChannels = new Manager<Channel>(
            this,
            new Repository(this.configuration.mongo.channelDatabase).get(PrivateChannelCollection),
            this.modelManagers.chanel,
        );

        this.presence = {
            game:   null,
            status: "offline",
        };
    }

    /**
     * Get the Discord gateway URL
     * @returns {Promise<String>} Resolves with the gateway URL
     */
    public getGateway() {
        return this.requestHandler.request("GET", Endpoints.GATEWAY);
    }

    /**
     * Get the Discord gateway URL along with bot metadata
     * @returns {Promise<Object>} Resolves with the gateway data
     */
    public getBotGateway() {
        if (this.token.indexOf("Bot ") !== 0) {
            this.token = "Bot " + this.token;
        }

        return this.requestHandler.request("GET", Endpoints.GATEWAY_BOT, true);
    }

    /**
     * Tells all shards to connect.
     * @returns {Promise} Resolves when all shards are initialized
     */
    public async connect() {
        Kernel.logger.debug("Connecting");
        return new Promise((resolve, reject) => {
            Promise.all([this.getBotGateway()])
                   .then((promises) => {
                       const data                   = promises[1];
                       this.configuration.maxShards = data.shards;

                       if (this.configuration.lastShard === undefined) {
                           this.configuration.lastShard = data.shards - 1;
                       }

                       if (!data.url) {
                           return Promise.reject(new Error("Invalid response from gateway REST call"));
                       }
                       if (data.url.includes("?")) {
                           data.url = data.url.substring(0, data.url.indexOf("?"));
                       }
                       if (!data.url.endsWith("/")) {
                           data.url += "/";
                       }
                       this.gatewayURL = `${data.url}?v=${Constants.GATEWAY_VERSION}&encoding=etf`;

                       for (let i = this.configuration.firstShard; i <= this.configuration.lastShard; i++) {
                           this.shardHandler.spawn(i);
                       }

                       resolve();
                   })
                   .catch((err) => {
                       if (!this.configuration.autoReconnect) {
                           return reject(err);
                       }

                       this.emit("error", err);

                       setTimeout(() => this.connect().then(resolve).catch(reject), 2000);
                   });
        });
    }
}
