import {EventEmitter} from "eventemitter3";
import Cache from "./Cache/Cache";
import CacheRepository from "./Cache/CacheRepository";
import Configuration from "./Config/Configuration";
import * as Constants from "./Config/Constants";
import * as Endpoints from "./Config/Endpoints";
import RequestHandler from "./Handler/RequestHandler";
import ShardHandler from "./Handler/ShardHandler";

import Guild, {GuildModel} from "./Database/Guild";
import User, {UserModel} from "./Database/User";

import KernelInjectionPlugin from "./Plugin/Mongo/KernelInjectionPlugin";
import Status from "./Database/Status";
import Collection from "./Helper/Collection";

export default class Kernel extends EventEmitter {
    public configuration: Configuration;
    public token: string;
    public gatewayURL: string;
    public requestHandler: RequestHandler;
    public shardHandler: ShardHandler;
    public cacheRepository: CacheRepository;
    public guilds: Cache<Guild>;
    public users: Cache<User>;
    public presence: { game: any; status: Status };
    public guildShardMap: { [name: string]: number } = {};
    public unavailableGuilds: Collection<any>;

    private ready: boolean;
    private startTime: number   = 0;
    private lastConnect: number = 0;

    //private shards;

    constructor(options) {
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

        this.requestHandler  = new RequestHandler(this);
        this.shardHandler    = new ShardHandler(this);
        this.cacheRepository = new CacheRepository(this);
        this.guilds          = this.cacheRepository.add<Guild>("guild", GuildModel);
        this.users           = this.cacheRepository.add<User>("user", UserModel);

        this.presence = {
            game:   null,
            status: "offline"
        };

        KernelInjectionPlugin(this);
    }

    get uptime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }

    /**
     * Get the Discord gateway URL
     * @returns {Promise<String>} Resolves with the gateway URL
     */
    getGateway() {
        return this.requestHandler.request("GET", Endpoints.GATEWAY);
    }

    /**
     * Get the Discord gateway URL along with bot metadata
     * @returns {Promise<Object>} Resolves with the gateway data
     */
    getBotGateway() {
        if (this.token.indexOf("Bot ") !== 0) {
            this.token = "Bot " + this.token;
        }

        return this.requestHandler.request("GET", Endpoints.GATEWAY_BOT, true);
    }

    /**
     * Tells all shards to connect.
     * @returns {Promise} Resolves when all shards are initialized
     */
    connect() {
        return this.getGateway().then((data) => {
            if (!data.url) {
                return Promise.reject(new Error("Invalid response from gateway REST call"));
            }
            if (data.url.includes("?")) {
                data.url = data.url.substring(0, data.url.indexOf("?"));
            }
            if (!data.url.endsWith("/")) {
                data.url += "/";
            }
            this.gatewayURL = data.url + "?v=" + Constants.GATEWAY_VERSION + "&encoding=etf";
            for (var i = this.configuration.firstShard; i <= this.configuration.lastShard; ++i) {
                this.shardHandler.spawn(i);
            }
        }).catch((err) => {
            if (!this.configuration.autoReconnect) {
                return Promise.reject(err);
            }
            this.emit("error", err);
            return new Promise((res, rej) => {
                setTimeout(() => this.connect().then(res).catch(rej), 2000);
            });
        });
    }
}