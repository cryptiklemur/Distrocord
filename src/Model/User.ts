import {instanceMethod, InstanceType, prop} from "typegoose";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";

export type Status = "online" | "offline" | "idle" | "invisible";

export default class User extends AbstractModel {
    /**
     * @type {string} The username of the user
     */
    @prop({required: true, index: true})
    public username: string;

    /**
     * @type {string} The discriminator of the user
     */
    @prop({required: true, index: true})
    public discriminator: string;

    /**
     * @type {Status} Online status of the user
     */
    @prop({index: true})
    public status?: Status;

    /**
     * @type {string|null} Game the user is playing
     */
    @prop()
    public game?: string;

    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    @prop()
    public avatar?: string;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    @prop({index: true, required: true, default: false})
    public bot: boolean;

    @instanceMethod
    public get mention(this: InstanceType<User>): string {
        return `<@${this.id}>`;
    }

    @instanceMethod
    public async initialize(
        this: InstanceType<User>,
        data: any,
        kernel: Kernel,
        parent?: AbstractModel,
    ): Promise<void> {
        this.bot = !!data.bot;

        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<User>, data: any, kernel: Kernel): Promise<void> {
        this.avatar        = data.avatar !== undefined ? data.avatar : this.avatar;
        this.username      = data.username !== undefined ? data.username : this.username;
        this.discriminator = data.discriminator !== undefined ? data.discriminator : this.discriminator;
    }
}

export const UserModel = new User().getModelForClass(User);
