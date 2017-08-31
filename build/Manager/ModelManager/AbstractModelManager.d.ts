import { SchemaFragment, SchemaFragmentArray } from "mongot";
import Kernel from "../../Kernel";
import ModelInterface from "../../Model/ModelInterface";
export default abstract class AbstractModelManager<T extends ModelInterface> {
    protected kernel: Kernel;
    private cls;
    constructor(kernel: Kernel, cls: any);
    create(): any;
    doInitialize(model: T, data: any, parent?: ModelInterface, update?: boolean): Promise<T>;
    doUpdate(model: T, data: any): Promise<T>;
    protected initialize(model: T, data: any, parent?: ModelInterface): Promise<void>;
    protected update(model: T, data: any): Promise<void>;
    protected updateField(model: T, field: string, data: any, name?: string, cast?: (data: any) => void): this;
    protected getSubDocument<U extends SchemaFragment>(model: T, data: any[], manager: AbstractModelManager<any | U>): Promise<SchemaFragmentArray<U>>;
}
