import UserPacket from "../../Gateway/Packet/UserPacket";
import ModelInterface from "../../Model/ModelInterface";
import User from "../../Model/User";
import AbstractModelManager from "./AbstractModelManager";

export default class UserManager extends AbstractModelManager<User> {
    public async initialize(model: User, data: UserPacket, parent?: ModelInterface): Promise<void> {
        this.updateField(model, "identifier", data, "id", (x) => x.toString())
            .updateField(model, "bot", data, null, (x) => !!x);
    }

    public async update(model: User, data: UserPacket): Promise<void> {
        this.updateField(model, "avatar", data)
            .updateField(model, "username", data)
            .updateField(model, "discriminator", data);
    }
}
