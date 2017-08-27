import AbstractCollection from "./AbstractCollection";
import User from "../Model/User";
import {collection, index} from "mongot";

@index('username')
@index('discriminator')
@index('status')
@index('game')
@index('createdAt')
@collection('users', User)
export default class UserCollection extends AbstractCollection<User> {

}