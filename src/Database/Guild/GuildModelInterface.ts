import GuildInterface from "./GuildInterface";
import * as mongoose from "mongoose";

interface GuildModelInterface extends GuildInterface, mongoose.Document {

}

export default GuildModelInterface;
