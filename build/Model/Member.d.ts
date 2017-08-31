import Guild from "./Guild";
import ModelInterface from "./ModelInterface";
import User from "./User";
export default class Member extends User implements ModelInterface {
    nick?: string;
    joinedAt: Date;
    roles: string[];
    guild: Guild;
}
