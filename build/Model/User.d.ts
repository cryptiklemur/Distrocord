import { Long } from "bson";
import { SchemaDocument } from "mongot";
import Kernel from "../Kernel";
import DocumentInterface from "./DocumentInterface";
export declare type UserStatus = "online" | "offline" | "idle" | "invisible";
export default class User extends SchemaDocument implements DocumentInterface {
    id: Long;
    /**
     * @type {string} The username of the user
     */
    username: string;
    /**
     * @type {string} The discriminator of the user
     */
    discriminator: string;
    /**
     * @type {Status} Online status of the user
     */
    status?: UserStatus;
    /**
     * @type {string|null} Game the user is playing
     */
    game?: string;
    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    avatar?: string;
    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    bot: boolean;
    kernel: Kernel;
    readonly createdAt: Date;
    readonly mention: string;
}
