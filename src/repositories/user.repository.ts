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

    async findUserById(userId: string, nonSensitive?:boolean):Promise<any>{
        if (nonSensitive) {
            const user =  await UserModel.findById(userId, {_id: 0, password: 0, googleId: 0, facebookId: 0, twitterId: 0, instagramId: 0, githubId: 0, friends: 0, followers: 0, following: 0, chats: 0, posts: 0, updatedAt: 0, __v: 0, });
            return user;
        };
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

    async updateByObjectId(objId: string, payload: UserPartialType){
        return await UserModel.findByIdAndUpdate(objId, payload).exec();
    };

    async updateByUserId(userId: string, payload: UserPartialType){
        return await UserModel.updateOne({userId}, {$set: payload});
    };

    async updateByUserReference(userRef: string, payload: UserPartialType){
        return await UserModel.findOneAndUpdate({userRef}, {$set: payload});
    };

    async fetchFollowers(userId: string, limit = 50, page = 1, nextpage = page+1, ){
        return await UserModel.find({userId},{followers: 1, _id: 0});
    };

    async fetchFollowing(userId: string, limit = 50, page = 1, nextpage = page+1, ){
        return await UserModel.find({userId},{following: 1, _id: 0});
    };

    async fetchFollowersCount(userId: string){
        return await UserModel.aggregate([
            {$match:{userId: userId,}},
            {$project: {_id: 0, count: {$size: "$followers"}}}
        ]);
    };

    async fetchFollowingCount(userId: string){
        return await UserModel.aggregate([
            {$match:{userId: userId,}},
            {$project: {_id: 0, count: {$size: "$following"}}}
        ]);
    };

    async followUser(userId: string, followedId: string){
        const addFollowing = await UserModel.updateOne({_id: userId}, {$push: {following: followedId}});
        const addFollower = await UserModel.updateOne({_id: followedId}, {$push: {followers: userId}})
        return {addFollower, addFollowing};
    };

    async unFollowUser(userId: string, unfollowedId: string){
        const removeFollowing = await UserModel.updateOne({_id: userId}, {$pull: {following: unfollowedId}});
        const removeFollower = await UserModel.updateOne({_id: unfollowedId}, {$pull: {followers: userId}});
        return {removeFollowing, removeFollower};
    };

    async findInFollowing(userId: string, followId: string){
        return await UserModel.find({
            _id: userId,
            following: {$in: [followId]}
        }).count();
    };

    async fetchFriends(userId: string, limit = 50, page = 1, nextpage = page+1, ){
        return await UserModel.find({userId},{following: 1, _id: 0});
    };

    async fetchChats(userId: string, limit = 50, page = 1, nextpage = page+1, ){
        return await UserModel.find({userId},{chats: 1, _id: 0});
    };

    async deleteUser(userReference: string){
        return await UserModel.deleteOne({userReference}).exec();
    };
};