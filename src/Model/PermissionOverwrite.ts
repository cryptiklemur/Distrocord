import {fragment, index, prop} from "mongot";
import Permission from "./Permission";

export type Type = "member" | "role";

@fragment
@index("type")
export default class PermissionOverwrite extends Permission {
    @prop
    public type: Type;
}
