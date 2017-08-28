import RolePacket from "../../Gateway/Packet/RolePacket";
import Guild from "../../Model/Guild";
import ModelInterface from "../../Model/ModelInterface";
import Permission from "../../Model/Permission";
import Role from "../../Model/Role";
import AbstractModelManager from "./AbstractModelManager";

export default class RoleManager extends AbstractModelManager<Role> {
    public async initialize(model: Role, data: RolePacket, parent?: Guild | ModelInterface): Promise<void> {
        model.guild = parent as Guild;
        this.updateField(model, "id", data, "id", (x) => x.toString());
    }

    public async update(model: Role, data: RolePacket): Promise<void> {
        this
            .updateField(model, "name", data)
            .updateField(model, "mentionable", data)
            .updateField(model, "managed", data)
            .updateField(model, "hoisted", data, "hoist")
            .updateField(model, "color", data)
            .updateField(model, "position", data)
            .updateField(model, "permissions", data, null, (allow) => new Permission({allow}));
    }
}
