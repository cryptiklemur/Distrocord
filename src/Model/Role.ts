import Kernel from "../Kernel";
import Guild from "./Guild";
import ModelInterface from "./ModelInterface";
import Permission from "./Permission";
import {fragment, index, prop, SchemaFragment} from "mongot";

@fragment
export default class Role extends SchemaFragment implements ModelInterface {
    @prop
    public identifier: string;

    @prop
    public name: string;

    @prop
    public mentionable: boolean;

    @prop
    public managed: boolean;

    @prop
    public hoisted: boolean;

    @prop
    public color: number;

    @prop
    public position: number;

    @prop
    public permissions: Permission;

    public guild: Guild;

    public get mention() {
        return "<@" + this.identifier + ">";
    }

    public get createdAt(): Date {
        return new Date((+this.identifier / 4194304) + 1420070400000);
    }

    public kernel: Kernel;
}
