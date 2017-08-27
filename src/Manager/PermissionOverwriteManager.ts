import OverwritePacket from "../Gateway/Packet/OverwritePacket";
import ModelInterface from "../Model/ModelInterface";
import PermissionOverwrite from "../Model/PermissionOverwrite";
import AbstractModelManager from "./AbstractModelManager";

export default class PermissionOverwriteManager extends AbstractModelManager<PermissionOverwrite> {
    public async initialize(model: PermissionOverwrite, data: OverwritePacket, parent?: ModelInterface): Promise<void> {
        this.updateField(model, "identifier", data, "id", (x) => x.toString())
            .updateField(model, "type", data);
    }
}
