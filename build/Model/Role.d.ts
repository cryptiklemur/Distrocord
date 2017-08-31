import { Long } from "bson";
import { SchemaFragment } from "mongot";
import Kernel from "../Kernel";
import Guild from "./Guild";
import ModelInterface from "./ModelInterface";
import Permission from "./Permission";
export default class Role extends SchemaFragment implements ModelInterface {
    id: Long;
    name: string;
    mentionable: boolean;
    managed: boolean;
    hoisted: boolean;
    color: number;
    position: number;
    permissions: Permission;
    guild: Guild;
    kernel: Kernel;
    readonly mention: string;
    readonly createdAt: Date;
}
