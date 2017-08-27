import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";
import {document, prop, SchemaDocument} from "mongot";

export type Status = "online" | "offline" | "idle" | "invisible";

@document
export default class User extends SchemaDocument implements ModelInterface {
    @prop
    public identifier: string;

    /**
     * @type {string} The username of the user
     */
    @prop
    public username: string;

    /**
     * @type {string} The discriminator of the user
     */
    @prop
    public discriminator: string;

    /**
     * @type {Status} Online status of the user
     */
    @prop
    public status?: Status;

    /**
     * @type {string|null} Game the user is playing
     */
    @prop
    public game?: string;

    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    @prop
    public avatar?: string;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    @prop
    public bot: boolean;

    public kernel: Kernel;

    public get createdAt(): Date {
        return new Date((+this.identifier / 4194304) + 1420070400000);
    }

    public get mention(): string {
        return `<@${this.identifier}>`;
    }
}
