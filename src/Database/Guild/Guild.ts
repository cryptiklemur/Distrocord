import * as mongoose from "mongoose";
import ClassToSchema from "../../Helper/ClassToSchema";
import GuildModelInterface from "./GuildModelInterface";

const Guild = mongoose.model<GuildModelInterface>("Guild", ClassToSchema(<GuildModelInterface> {}));

export default Guild;