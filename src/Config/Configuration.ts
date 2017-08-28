export type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

interface MongoConfiguration {
    guildDatabase: string;
    userDatabase: string;
    channelDatabase: string;
}

export default class Configuration {
    public token: string;
    public mongo: MongoConfiguration;
    public logLevel: LogLevel         = "info";
    public autoReconnect: boolean     = true;
    public connectionTimeout: number  = 30000;
    public disableEvents: string[]    = [];
    public firstShard: number         = 0;
    public lastShard?: number;
    public maxShards?: number;
    public defaultImageFormat: string = "jpg";
    public defaultImageSize: number   = 128;
    public messageLimit: number       = 1024;
    public getAllUsers: boolean       = false;
    public guildCreateTimeout: number = 20000;

    constructor(options: Configuration) {
        if (!options.token) {
            throw new Error("token is required.");
        }

        const mongo = options.mongo;
        if (!mongo || !mongo.guildDatabase || !mongo.userDatabase || !mongo.channelDatabase) {
            throw new Error("mongo is required.");
        }

        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
    }
}
