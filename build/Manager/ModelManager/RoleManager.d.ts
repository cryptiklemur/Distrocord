import RolePacket from "../../Gateway/Packet/RolePacket";
import Guild from "../../Model/Guild";
import ModelInterface from "../../Model/ModelInterface";
import Role from "../../Model/Role";
import AbstractModelManager from "./AbstractModelManager";
export default class RoleManager extends AbstractModelManager<Role> {
    initialize(model: Role, data: RolePacket, parent?: Guild | ModelInterface): Promise<void>;
    update(model: Role, data: RolePacket): Promise<void>;
}
