import {Collection, index} from "mongot";
import ModelInterface from "../Model/ModelInterface";

@index('identifier', {unique: true})
export default abstract class AbstractCollection<T extends ModelInterface> extends Collection<T> {
    findByIdentifier(identifier: string) {
        return this.findOne({identifier});
    }
}
