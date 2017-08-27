require("source-map-support").install();

import Configuration from "./Config/Configuration";
import Kernel from "./Kernel";

const kernel = new Kernel({
    token: "MTcwMTA5MzIxOTQ0NzYwMzIw.DIOoGQ.rXe8edHQNPNTTG6AgvqT2U6BY54",
} as Configuration);

kernel.on("error", console.error);
kernel.connect();
