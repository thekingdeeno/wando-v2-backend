import { User, UserModel, UserPartialType, UserI } from "../model/users";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User, UserI> {
    constructor(){
        super(UserModel);
    };

    async createUser(payload: UserPartialType):Promise<User>{
         const newUser = new UserModel(payload)
        return await newUser.save();
    }
}