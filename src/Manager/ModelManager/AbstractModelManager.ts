import {SchemaFragment, SchemaFragmentArray} from "mongot";
import Kernel from "../../Kernel";
import ModelInterface from "../../Model/ModelInterface";

export default abstract class AbstractModelManager<T extends ModelInterface> {
    constructor(protected kernel: Kernel, private cls: any) {
    }

    public create() {
        return new (this.cls)();
    }

    public async doInitialize(model: T, data: any, parent?: ModelInterface, update: boolean = true): Promise<T> {
        await this.initialize(model, data, parent);

        return update ? await this.doUpdate(model, data) : model;
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

        if (value !== undefined && value !== null) {
            model[field] = value;
        }

        return this;
    }

    protected async getSubDocument<U extends SchemaFragment>(
        model: T,
        data: any[],
        manager: AbstractModelManager<any | U>,
    ): Promise<SchemaFragmentArray<U>> {
        const models = [];
        for (const item of data) {
            models.push(await manager.doInitialize(manager.create(), item, model as any, true));
        }

        return new SchemaFragmentArray(models);
    }
}
