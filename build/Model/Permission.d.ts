import { Long } from "bson";
import { SchemaFragment } from "mongot";
import Kernel from "../Kernel";
import ModelInterface from "./ModelInterface";
export default class Permission extends SchemaFragment implements ModelInterface {
    id: Long;
    allow: number;
    deny: number;
    kernel: Kernel;
    private _json;
    readonly createdAt: Date;
    readonly json: any;
    /**
     * Check if this permission allows a specific permission
     * @arg {String} permission The name of the permission. [A full list of permission nodes can be found on the docs
     *     reference page](/Eris/docs/reference)
     * @returns {Boolean} Whether the permission allows the specified permission
     */
    has(permission: string): boolean;
}
