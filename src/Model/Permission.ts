import {Permissions} from "../Config/Constants";
import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";
import {fragment, prop, SchemaFragment} from "mongot";

@fragment
export default class Permission extends SchemaFragment implements ModelInterface {
    @prop
    public identifier: string;

    @prop
    public allow: number;

    @prop
    public deny: number = 0;

    public kernel: Kernel;

    public get createdAt(): Date {
        return new Date((+this.identifier / 4194304) + 1420070400000);
    }

    public get json(): any {
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

    private _json: any;

    /**
     * Check if this permission allows a specific permission
     * @arg {String} permission The name of the permission. [A full list of permission nodes can be found on the docs
     *     reference page](/Eris/docs/reference)
     * @returns {Boolean} Whether the permission allows the specified permission
     */
    public has(permission: string): boolean {
        return !!(this.allow & Permissions[permission]);
    }
}
