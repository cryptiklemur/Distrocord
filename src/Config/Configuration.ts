export default class Configuration {
    public token: string;
    public autoReconnect: boolean       = true;
    public connectionTimeout: number    = 30000;
    public disableEvents: Array<string> = [];
    public firstShard: number           = 0;
    public lastShard: number            = 0;
    public maxShards: number            = 1;
    public useShardSuggestions: boolean = true;
    public defaultImageFormat: string   = "jpg";
    public defaultImageSize: number     = 128;
    public getAllUsers: boolean         = false;
    public guildCreateTimeout: number   = 20000;

    constructor(options: any) {
        if (options.token) {
            throw new Error("Token is required.");
        }

        for (let key in options) {
            if (options.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }
    }
}
