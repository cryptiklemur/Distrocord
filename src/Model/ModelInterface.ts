import Kernel from "../Kernel";

interface ModelInterface {
    kernel: Kernel;

    identifier: string;

    readonly createdAt: Date;
}

export default ModelInterface;