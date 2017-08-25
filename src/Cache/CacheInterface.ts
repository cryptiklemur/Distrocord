import ModelInterface from "../Model/ModelInterface";

interface CacheInterface<T extends ModelInterface> {
    add(object: T): Promise<T>;
    get(id: string): Promise<T>;
    update(object: T): Promise<T>;
    remove(object: T): Promise<boolean>;
    findOne(query: any): Promise<T>;
    findAll(query: any): Promise<Array<T>>;
    size(): Promise<number>;

    toString(): string;
}

export default CacheInterface;
