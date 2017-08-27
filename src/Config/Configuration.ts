export default class Configuration {
    public token: string;
    public autoReconnect: boolean       = true;
    public connectionTimeout: number    = 30000;
    public disableEvents: string[] = [];
    public firstShard: number           = 0;
    public lastShard?: number;
    public maxShards?: number;
    public defaultImageFormat: string   = "jpg";
    public defaultImageSize: number     = 128;
    public getAllUsers: boolean         = false;
    public guildCreateTimeout: number   = 20000;

    constructor(options: Configuration) {
        if (!options.token) {
            throw new Error("Token is required.");
        }

        for (const key in options) {
            if (options.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
    }
}
