import Permission from "./Permission";
export declare type Type = "member" | "role";
export default class PermissionOverwrite extends Permission {
    type: Type;
}
