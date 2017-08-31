import {IsArray, IsBoolean, IsNumber, IsString, ValidateNested} from "class-validator";

export type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export class MongoConfiguration {
    @IsString()
    public guildDatabase: string;
    @IsString()
    public userDatabase: string;
    @IsString()
    public channelDatabase: string;

    constructor(options?: MongoConfiguration) {
        Object.assign(this, options);
    }
}

//noinspection TsLint
export default class Configuration {
    @IsString()
    public token: string;

    @ValidateNested()
    public mongo: MongoConfiguration;

    @IsString()
    public logLevel: LogLevel         = "info";

    @IsBoolean()
    public autoReconnect: boolean     = true;

    @IsNumber()
    public connectionTimeout: number  = 30000;

    @IsArray()
    public disableEvents: string[]    = [];

    @IsNumber()
    public firstShard: number         = 0;

    @IsNumber()
    public lastShard?: number;

    @IsNumber()
    public maxShards?: number;

    @IsString()
    public defaultImageFormat: string = "jpg";

    @IsNumber()
    public defaultImageSize: number   = 128;

    @IsNumber()
    public messageLimit: number       = 1024;

    @IsBoolean()
    public getAllUsers: boolean       = false;

    @IsNumber()
    public guildCreateTimeout: number = 20000;

    constructor(options?: Configuration) {
        if (!options) {
            options = {} as Configuration;
        }

        if (!options.token) {
            throw new Error("token is required.");
        }

        const mongo = options.mongo;
        if (!mongo || !mongo.guildDatabase || !mongo.userDatabase || !mongo.channelDatabase) {
            throw new Error("mongo is required.");
        }

        Object.assign(this, options);
    }
}
