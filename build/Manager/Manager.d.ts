import { Long } from "bson";
import AbstractCollection from "../Collection/AbstractCollection";
import Kernel from "../Kernel";
import DocumentInterface from "../Model/DocumentInterface";
import AbstractModelManager from "./ModelManager/AbstractModelManager";
export default class Manager<T extends DocumentInterface> {
    protected kernel: Kernel;
    protected collection: AbstractCollection<T>;
    protected manager: AbstractModelManager<T>;
    constructor(kernel: Kernel, collection: AbstractCollection<T>, manager: AbstractModelManager<T>);
    upsert(data: any): Promise<any>;
    get(id: Long | string): Promise<T>;
    all(): Promise<T[]>;
    count(query?: any): Promise<number>;
    remove(id: Long | T): Promise<T>;
    forEach(callback: (value: T, index: number, array: T[]) => void, parallel?: boolean): Promise<void>;
}
