import UserInterface from "./UserInterface";
import * as mongoose from "mongoose";

interface UserModelInterface extends UserInterface, mongoose.Document {

}

export default UserModelInterface;
