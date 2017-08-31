import UserPacket from "../../Gateway/Packet/UserPacket";
import ModelInterface from "../../Model/ModelInterface";
import User from "../../Model/User";
import AbstractModelManager from "./AbstractModelManager";
export default class UserManager extends AbstractModelManager<User> {
    initialize(model: User, data: UserPacket, parent?: ModelInterface): Promise<void>;
    update(model: User, data: UserPacket): Promise<void>;
}
