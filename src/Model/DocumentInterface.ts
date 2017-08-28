import {SchemaDocument} from "mongot";
import ModelInterface from "./ModelInterface";

interface DocumentInterface extends ModelInterface, SchemaDocument {

}

export default DocumentInterface;
