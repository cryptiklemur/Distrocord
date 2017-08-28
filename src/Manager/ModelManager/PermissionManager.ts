import ModelInterface from "../../Model/ModelInterface";
import Permission from "../../Model/Permission";
import AbstractModelManager from "./AbstractModelManager";

export default class PermissionManager extends AbstractModelManager<Permission> {
    public async initialize(model: Permission, data: any, parent?: ModelInterface): Promise<void> {
        this.updateField(model, "id", data, "id", (x) => x.toString());
    }
}
