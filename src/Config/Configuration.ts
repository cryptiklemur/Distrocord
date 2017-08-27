export type LogLevel = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export default class Configuration {
    public token: string;
    public mongoConnectionUrl: any;
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
        if (!options.mongoConnectionUrl) {
            throw new Error("mongoConnectionUrl is required.");
        }

        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
    }
}
