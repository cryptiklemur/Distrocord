import Kernel from "../Kernel";

interface ModelInterface {
    kernel: Kernel;

    id: string;

    readonly createdAt: Date;
}

export default ModelInterface;
