import {instanceMethod, InstanceType, prop} from "typegoose";
import {Permissions} from "../Config/Constants";
import Base from "./AbstractModel";

export default class Permission extends Base {
    @prop()
    public allow: number;

    @prop({default: 0})
    public deny: number;

    private _json: any;

    get json(): any {
        if (!this._json) {
            this._json = {};
            for (var perm of Object.keys(Permissions)) {
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
    has(this: InstanceType<Permission>, permission: string): boolean {
        return !!(this.allow & Permissions[permission]);
    }
}

export const PermissionModel = new Permission().getModelForClass(Permission);