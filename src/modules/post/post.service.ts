import { injectable } from 'tsyringe';
import PostRepository from '../../repositories/post.repository';
import { UploadPostDTO } from '../../shared/types/general.type';
import UploadService from '../../shared/services/cloud-storage.service';
import  httpStatus  from 'http-status';
import { cloudStorageHandler } from '../../config/env.config';
import { genAlphaNum } from '../../shared/utils/generate.utils';
import { UserRepository } from '../../repositories/user.repository';

@injectable()
class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly uploaadService: UploadService,
        private readonly userRepository: UserRepository
    ){}

    public async createPost(payload: UploadPostDTO){
        try {
            if (payload.quoteId) {
                const post = await this.postRepository.getPost(payload.quoteId)
                if (post.length === 0) {
                    throw new Error('Could not find the post to be quoted');
                };
            }
            const {uploads, text, userId, ...rest} = payload;
            if (!uploads && !text) throw new Error('No content in post');
            const mediaUrls = [];
            for (let i = 0; i < uploads.length; i++) {
                const file = uploads[i];
                const date = new Date();
                const timestamp = (Math.round(date.getTime()/1000));
                const upload = {
                    file: file.buffer,
                    fileName: `${timestamp}${genAlphaNum(10)}`,
                    filePath: 'posts'
                }
                const response = await this.uploaadService.uploadMedia(userId, cloudStorageHandler, 'post' ,upload);
                if (response.status) {
                    mediaUrls.push(response.record.url);
                }
            }
            const post = await this.postRepository.createPost({text, userId, ...rest, mediaUrls});
            if (!post) throw new Error('Failed to create post record');
            if (post.quoteId) {
                await this.postRepository.addRepost(post.quoteId, userId);
            };
            const user = await this.userRepository.addToPosts(userId, post.postId)
            if (!user.acknowledged && (user.modifiedCount!==1)) {
                throw new Error('Failed to add to user post');
            };
            return{
                status: true,
                data: post,
                message:'Post created successfully' 
            };
        } catch (error) {
            console.log(`[Error]::createPost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::createPost====>${error.message}`};
        }
    }

    public async getPost(postId: string){
        try {
            const data = await this.postRepository.getPost(postId);
            return{
                status: true,
                data,
                message:'Post fetched successfully' 
            }
        } catch (error: any) {
            console.log(`[Error]::getPost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::getPost====>${error.message}`};
        }
    }

    public async getPosts(page: number = 1, limit: number = 20){
        try {
            const data = await this.postRepository.getPosts(page, limit);
            return{
                status: true,
                data,
                message:'Posts fetched successfully' 
            }
            
        } catch (error: any) {
            console.log(`[Error]::getPost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::getPost====>${error.message}`};
        }
    }

    public async getUserPosts(userId: string, page: number = 1, limit: number = 20){
        try {
            const data = await this.postRepository.getUserPosts(userId, page, limit);
            return{
                status: true,
                data,
                message:'User posts fetched successfully' 
            }
        } catch (error:any) {
            console.log(`[Error]::getUserPosts====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::getUserPosts====>${error.message}`};
        };
    };
    
    public async addComment(postId: string, userId: string, text: string){
        try {
            const user = await this.userRepository.findUserById(userId)
            const comment = await this.postRepository.addComment(postId, userId, user.username, text);
            console.log(comment);
            return{
                status: true,
                message:'Comment added successfully' 
            };
        } catch (error:any) {
            console.log(`[Error]::addComment====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::addComment====>${error.message}`};
        }
    };

    public async fetchComments(postId: string, page: number, limit: number){
        try {
            const comments = await this.postRepository.fetchComments(postId, page, limit);
            return {
                status: true,
                data: comments,
                message: 'Comments retuned successfuly'
            }
        } catch (error) {
            console.log(`[Error]::fetchComments====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::fetchComments====>${error.message}`};
        }
    };

    public async likePost(postId: string, userId: string){
        try {

            // function to check if user alreasy liked the post posts here

            const post = await this.postRepository.likePost(postId, userId);
            const user = await this.userRepository.addToLikes(userId, postId);
            if (post.modifiedCount!==1) {
                if (user.acknowledged && (user.modifiedCount===1)) {
                    //detete like here
                }
                throw new Error('failed to update post likes');
            };
            if (user.modifiedCount!==1) {
                if (post.acknowledged && (post.modifiedCount===1)) {
                    //detete like here
                }
                throw new Error('failed to update users liked posts');
            };
            return {
                status: true,
                message: 'Post Liked'
            }
        } catch (error: any) {
            console.log(`[Error]::likePost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::likePost====>${error.message}`};
        };
    };

    public async unlinkePost(){
        // Im tired, i'll do this later Lol 
    }

    public async savePost(postId: string, userId: string){
        try {

            // function to check if user alreasy saved the post posts here

            const post = await this.postRepository.savePost(postId, userId);
            const user = await this.userRepository.addToSaves(userId, postId);
            if (post.modifiedCount!==1) {
                if (user.acknowledged && (user.modifiedCount===1)) {
                    //detete save here
                }
                throw new Error('failed to update post saves');
            };
            if (user.modifiedCount!==1) {
                if (post.acknowledged && (post.modifiedCount===1)) {
                    //detete save here
                }
                throw new Error('failed to update users saved posts');
            };
            return {
                status: true,
                message: 'Post Liked'
            }
        } catch (error: any) {
            console.log(`[Error]::likePost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::likePost====>${error.message}`};
        };
    };

    public async repost(userId: string, postId: string){
        try {
            const user = await this.userRepository.addToPosts(userId, postId);
            if (!user.acknowledged && (user.modifiedCount!==1)) {
                throw new Error('Failed to add repost to users posts');
            }
            const post = await this.postRepository.addRepost(postId, userId);
            if (!post.acknowledged && (post.modifiedCount!==1)) {
                throw new Error('Failed to add repost to post reposts');
            }
            return {
                status: true,
                message: 'Post reposted'
            }
        } catch (error: any) {
            console.log(`[Error]::repost====>${error.message}`);
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: `[Error]::repost====>${error.message}`};
        }
    };
};

export default PostService