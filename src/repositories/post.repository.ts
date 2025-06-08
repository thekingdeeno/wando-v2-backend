import { BaseRepository } from "./base.repository";
import { Post, PostModel, PostPartialType, PostI } from "../model/posts";

class PostRepository extends BaseRepository<Post, PostI> {
    constructor(){
        super(PostModel)
    };

    async createPost(payload: PostPartialType){
        return await new PostModel(payload).save();
    };

    async getPost(postId: string ){
        const post = await PostModel.aggregate([
            {
                $match: { postId: postId }
            },
            {
                $project: {
                    _id: 0,
                    postId: 1,
                    title:1,
                    text: 1,
                    mediaUrls: 1,
                    likes: {$cond:{ if:{$isArray: "$likes"}, then: {$size: "$likes"}, else: "NA"}},comments: {$size: "$comments"},reposts: {$size: "$reposts"},shares: {$size: "$shares"},saves: {$size: "$saves"}
                }
            }
        ]);
        return post
    };

    async getPosts(page: number, limit: number){
        return await PostModel.find({},{comments: {$slice:[0, 10]}})
            .sort({createdAt: -1})
            .skip((page-1) * limit)
            .limit(limit)
    };

    async getUserPosts(userId: string,page: number, limit: number){

        return await PostModel.find({userId}, {comments: {$slice:[0, 10]}})
            .sort({createdAt: -1})
            .skip((page-1) * limit)
            .limit(limit)
    };

    async likePost(postId: string, userId: string){
        return await PostModel.updateOne({postId}, {$push:{
            likes: userId
        }})
    }

    async savePost(postId: string, userId: string){
        return await PostModel.updateOne({postId}, {$push:{
            saves: userId
        }})
    }

    async addComment( postId: string, userId: string, userName: string, comment: string){
        return await PostModel.updateOne({postId},{$push: {
            comments: {
                userId: userId,
                username: userName,
                text: comment
            }
        }});
    };

    async fetchComments(postId: string, page: number = 1, limit: number = 20){
        // for some wierd reason mongo thinks page and limit are strings so i have to multiply it by 1 ... crazy
        const skipValue = (limit * page) - limit
        const comments = (await PostModel.findOne({postId}, {comments: {$slice: [skipValue*1, limit*1]}})).comments
        return comments
    }

    async addRepost(postId: string, userId: string){
        return await PostModel.updateOne({postId}, {$push: {
            reposts: userId
        }})
    }
};

export default PostRepository;