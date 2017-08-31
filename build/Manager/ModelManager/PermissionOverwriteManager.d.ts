import OverwritePacket from "../../Gateway/Packet/OverwritePacket";
import ModelInterface from "../../Model/ModelInterface";
import PermissionOverwrite from "../../Model/PermissionOverwrite";
import AbstractModelManager from "./AbstractModelManager";
export default class PermissionOverwriteManager extends AbstractModelManager<PermissionOverwrite> {
    initialize(model: PermissionOverwrite, data: OverwritePacket, parent?: ModelInterface): Promise<void>;
    protected update(model: PermissionOverwrite, data: any): Promise<void>;
}
