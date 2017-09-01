import {IsString} from "class-validator";

export default class MongoConfiguration {
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
