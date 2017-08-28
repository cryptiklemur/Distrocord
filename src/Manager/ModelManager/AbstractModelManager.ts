import Kernel from "../../Kernel";
import ModelInterface from "../../Model/ModelInterface";

export default abstract class AbstractModelManager<T extends ModelInterface> {
    constructor(protected kernel: Kernel) {
    }

    public async doInitialize(model: T, data: any, parent?: ModelInterface): Promise<T> {
        model.kernel = this.kernel;
        await this.initialize(model, data, parent);

        return await this.doUpdate(model, data);
    }

    public async doUpdate(model: T, data: any): Promise<T> {
        await this.update(model, data);

        return model;
    }

    protected async initialize(model: T, data: any, parent?: ModelInterface): Promise<void> {
        return;
    }

    protected async update(model: T, data: any): Promise<void> {
        return;
    }

    protected updateField(
        model: T,
        field: string,
        data: any,
        name?: string,
        cast?: (data: any) => void,
    ) {
        if (data[name || field] === undefined) {
            return this;
        }

        let value = data[name || field];
        if (!!cast) {
            value = cast(value);
        }

        if (value !== undefined) {
            model[field] = value;
        }

        return this;
    }
}
