import {Long} from "bson";
import {fragment, prop, SchemaFragment} from "mongot";
import Kernel from "../Kernel";
import Guild from "./Guild";
import ModelInterface from "./ModelInterface";
import Permission from "./Permission";

@fragment
export default class Role extends SchemaFragment implements ModelInterface {
    @prop
    public id: Long;

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
    public kernel: Kernel;

    public get mention() {
        return "<@" + this.id + ">";
    }

    public get createdAt(): Date {
        return new Date(+this.id.div(Long.fromNumber(4194304)).add(Long.fromNumber(1420070400000)).toString());
    }
}
