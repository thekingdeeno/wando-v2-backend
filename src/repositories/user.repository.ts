import { User, UserModel, UserPartialType, UserI } from "../model/users";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<User, UserI> {
    constructor(
    ){
        super(UserModel);
    };

    async createUser(payload: UserPartialType):Promise<User>{
         return await new UserModel(payload).save();
    };

    async findUserById(userId: string):Promise<User>{
    return await UserModel.findById(userId);
    };

    async findUserByEmail(email: string):Promise<User>{
        return await UserModel.findOne({email}).exec();
    };

    async findUserByPhoneNo(phoneNumber: string):Promise<User>{
        return await UserModel.findOne({phoneNumber}).exec();
    };

    async findUserByUsername(username: string):Promise<User>{
        return await UserModel.findOne({username}).exec();
    };

    async updateByObjectId(objId: string, payload: any){
        return await UserModel.findByIdAndUpdate(objId, payload).exec();
    };

    async updateByUserId(userId: string, payload: any){
        return await UserModel.updateOne({userId}, {$set: payload})
    };

    async updateByUserReference(userRef: string, payload: any){
        return await UserModel.findOneAndUpdate({userRef}, {$set: payload});

    };

    async deleteUser(userReference: string){
        return await UserModel.deleteOne({userReference}).exec();
    };
};