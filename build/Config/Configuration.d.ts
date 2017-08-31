export declare type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";
export interface MongoConfiguration {
    guildDatabase: string;
    userDatabase: string;
    channelDatabase: string;
}
export default class Configuration {
    token: string;
    mongo: MongoConfiguration;
    logLevel: LogLevel;
    autoReconnect: boolean;
    connectionTimeout: number;
    disableEvents: string[];
    firstShard: number;
    lastShard?: number;
    maxShards?: number;
    defaultImageFormat: string;
    defaultImageSize: number;
    messageLimit: number;
    getAllUsers: boolean;
    guildCreateTimeout: number;
    constructor(options?: Configuration);
}
