import {Long} from "bson";
import Kernel from "../Kernel";

interface ModelInterface {
    kernel: Kernel;

    id: Long;

    readonly createdAt: Date;
}

export default ModelInterface;
