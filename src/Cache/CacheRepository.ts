import Cache from "./Cache";
import ModelInterface from "../Model/ModelInterface";
import {Document, Model} from "mongoose";

export default class CacheRepository {
    private caches: {[name: string]: Cache<any>} = {};

    constructor(private kernel) {
    }

    public add<T extends ModelInterface>(key: string, type: Model<Document>): Cache<T> {
        this.caches[key] = new Cache<T>(type);

        return this.caches[key];
    }

    public get<T extends ModelInterface>(key: string): Cache<T> {
        return <Cache<T>> this.caches[key];
    }
}
