import Permission from "./Permission";
import {fragment, index, prop} from "mongot";

export type Type = "member" | "role";

@fragment
@index('type')
export default class PermissionOverwrite extends Permission {
    @prop
    public type: Type;
}
