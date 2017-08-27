import {instanceMethod, InstanceType, prop} from "typegoose";
import AbstractModel from "./AbstractModel";
import Kernel from "../Kernel";



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
    public status: Status;

    /**
     * @type {string|null} Game the user is playing
     */
    @prop()
    public game?: string | null;

    /**
     * @type {string|null} The hash of the user's avatar, or null if no avatar
     */
    @prop()
    public avatar?: string | null;

    /**
     * @type {boolean} Whether the user is an OAuth bot or not
     */
    @prop({index: true})
    public bot: boolean;

    @instanceMethod
    public get mention(this: InstanceType<User>): string {
        return `<@${this.id}>`;
    }

    @instanceMethod
    public initialize(this: InstanceType<User>, data: any, kernel: Kernel, parent?: AbstractModel): Promise<any> {
        return undefined;
    }

    @instanceMethod
    public update(this: InstanceType<User>, data: any, kernel: Kernel): Promise<any> {
        return undefined;
    }
}

export const UserModel = new User().getModelForClass(User);