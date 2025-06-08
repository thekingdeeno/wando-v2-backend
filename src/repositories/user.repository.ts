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
        const user = await UserModel.aggregate([
            {
                $match: {userId}
            },
            {
                $project:{
                    _id: 0,
                    userId: 1,
                    firstName: 1,
                    lastName: 1,
                    username: 1,
                    email: 1,
                    bio: 1,
                    link: 1,
                    posts: {$size: "$posts"},
                    following: {$size: "$following"},
                    followers: {$size: "$followers"},
                },
            },
        ])
            return user[0];
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

    async fetchFollowers(userId: string, page = 1, limit = 30, ){
        const skipValue = (limit * page) - limit
        const followers = (await UserModel.findOne({userId}, {followers: {$slice: [skipValue*1, limit*1]}})).followers
        return followers
    };

    async fetchFollowing(userId: string, page = 1, limit = 30,){
        const skipValue = (limit * page) - limit
        const following = (await UserModel.findOne({userId}, {following: {$slice: [skipValue*1, limit*1]}})).following
        return following
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

    async addToPosts(userId: string, postId: string){
        return await UserModel.updateOne({userId}, {$push:{
            posts: postId,
        }})
    };

    async addToLikes(userId: string, postId: string){
        return await UserModel.updateOne({userId}, {$push:{
            likes: postId
        }})
    };

    async addToSaves(userId: string, postId: string){
        return await UserModel.updateOne({userId}, {$push:{
            saves: postId
        }})
    };

    async fetchFriends(userId: string, limit = 50, page = 1 ){
        const skipValue = (limit * page) - limit
        const friends = (await UserModel.findOne({userId}, {friends: {$slice: [skipValue*1, limit*1]}})).friends
        return friends
    };

    async fetchChats(userId: string, limit = 50, page = 1, nextpage = page+1, ){
        const skipValue = (limit * page) - limit
        const chats = (await UserModel.findOne({userId}, {chats: {$slice: [skipValue*1, limit*1]}})).chats;
        return chats
    };

    async deleteUser(userReference: string){
        return await UserModel.deleteOne({userReference}).exec();
    };
};