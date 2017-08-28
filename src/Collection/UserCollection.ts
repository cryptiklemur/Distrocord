import {collection, index} from "mongot";
import User from "../Model/User";
import AbstractCollection from "./AbstractCollection";

@index("username")
@index("discriminator")
@index("status")
@index("game")
@index("createdAt")
@collection("users", User)
export default class UserCollection extends AbstractCollection<User> {

}
