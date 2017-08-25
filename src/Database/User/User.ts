import * as mongoose from "mongoose";
import ClassToSchema from "../../Helper/ClassToSchema";
import UserModelInterface from "./UserModelInterface";

const User = mongoose.model<UserModelInterface>("User", ClassToSchema(<UserModelInterface> {}));

export default User;