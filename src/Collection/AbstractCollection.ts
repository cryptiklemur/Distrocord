import {Long} from "bson";
import {Collection, index} from "mongot";
import DocumentInterface from "../Model/DocumentInterface";

@index("id", {unique: true})
export default abstract class AbstractCollection<T extends DocumentInterface> extends Collection<T> {
    public findById(id: string | Long) {
        return this.findOne({id: id instanceof Long ? id.toString() : id});
    }
}
