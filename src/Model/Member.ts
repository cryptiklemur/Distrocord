import {fragment, index, prop} from "mongot";
import Kernel from "../Kernel";
import Guild from "./Guild";
import ModelInterface from "./ModelInterface";
import User from "./User";

@fragment
@index("user")
@index("joinedAt")
export default class Member extends User implements ModelInterface {
    @prop
    public user: string;

    @prop
    public nick?: string;

    @prop
    public joinedAt: Date;

    @prop
    public roles: string[];

    public guild: Guild;

    public kernel: Kernel;

    public get identifier(): string {
        return this.user;
    }
}
