import { Long } from "bson";
import { Collection } from "mongot";
import DocumentInterface from "../Model/DocumentInterface";
export default abstract class AbstractCollection<T extends DocumentInterface> extends Collection<T> {
    findById(id: string | Long): Promise<T>;
}
