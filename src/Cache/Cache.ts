import {Document, Model} from "mongoose";

import CacheInterface from "./CacheInterface";
import ModelInterface from "../Model/ModelInterface";

export default class Cache<T extends ModelInterface> implements CacheInterface<T> {
    constructor(private model: Model<Document>) {
    }

    toString(): string {
        throw new Error("Method not implemented.");
    }

    async add(object: T): Promise<T> {
        await object.save();

        return object;
    }

    async get(identifier: string): Promise<T> {
        return await this.findOne({identifier});
    }

    async update(object: any): Promise<T> {
        await object.save();

        return object;
    }

    async remove(object: any): Promise<boolean> {
        await object.remove();

        return true;
    }

    async findOne(query: any): Promise<T> {
        return <any> await this.model.findOne(query);
    }

    async findAll(query: any): Promise<Array<T>> {
        return <Array<any>> await this.model.find(query);
    }

    async size(query: any = {}): Promise<number> {
        return await this.model.count(query);
    }
}
