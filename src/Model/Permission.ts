import {instanceMethod, InstanceType, prop} from "typegoose";
import {Permissions} from "../Config/Constants";
import Kernel from "../Kernel";
import AbstractModel from "./AbstractModel";

export default class Permission extends AbstractModel {

    @prop({required: true})
    public allow: number;

    @prop({required: true, default: 0})
    public deny: number;

    private _json: any;

    get json(): any {
        if (!this._json) {
            this._json = {};
            for (const perm of Object.keys(Permissions)) {
                if (!perm.startsWith("all")) {
                    if (this.allow & Permissions[perm]) {
                        this._json[perm] = true;
                    } else if (this.deny & Permissions[perm]) {
                        this._json[perm] = false;
                    }
                }
            }
        }
        return this._json;
    }

    /**
     * Check if this permission allows a specific permission
     * @arg {String} permission The name of the permission. [A full list of permission nodes can be found on the docs
     *     reference page](/Eris/docs/reference)
     * @returns {Boolean} Whether the permission allows the specified permission
     */
    @instanceMethod
    public has(this: InstanceType<Permission>, permission: string): boolean {
        return !!(this.allow & Permissions[permission]);
    }

    @instanceMethod
    public async initialize(
        this: InstanceType<Permission>,
        data: any,
        kernel: Kernel,
        parent?: AbstractModel,
    ): Promise<void> {
        await this.update(data, kernel);
    }

    @instanceMethod
    public async update(this: InstanceType<Permission>, data: any, kernel: Kernel): Promise<void> {
        return;
    }
}

export const PermissionModel = new Permission().getModelForClass(Permission);
