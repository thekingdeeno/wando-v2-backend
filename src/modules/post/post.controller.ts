import { injectable } from 'tsyringe';
import PostService from './post.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getReq } from '../../shared/utils/request.utils';
import httpStatus from 'http-status';

@injectable()
class PostController {
    constructor(
        private postService: PostService
    ){}

    createPost = async (req: FastifyRequest, res: FastifyReply)=>{
        const payload = req.body as any;
        payload.userId = getReq(req, 'userId');
        const data = await this.postService.createPost(payload);
        return res.status(httpStatus.OK).send(data);
    };

    getPost = async (req: FastifyRequest, res: FastifyReply)=>{
        const {postId} = req.params as any;
        const data = await this.postService.getPost(postId);
        return res.status(httpStatus.OK).send(data);
    };

    getPosts = async (req: FastifyRequest, res: FastifyReply)=>{
        const {page, limit} = req.params as any;
        const data = await this.postService.getPosts(page, limit);
        return res.status(httpStatus.OK).send(data);
    };

    getUserPosts = async (req: FastifyRequest, res: FastifyReply)=>{
        const {page, limit} = req.params as any;
        const {userId} = req.query as any;
        const data = await this.postService.getUserPosts(userId ? userId : getReq(req,'userId'), page, limit);
        return res.status(httpStatus.OK).send(data);
    };
    likePost = async (req: FastifyRequest, res: FastifyReply)=>{
        const {postId} = req.params as any
        const data = await this.postService.likePost(postId, getReq(req,'userId'));
        return res.status(httpStatus.OK).send(data);
    };
    addComment = async (req: FastifyRequest, res: FastifyReply)=>{
        const {postId} = req.params as any
        const {comment} = req.body as any;
        const data = await this.postService.addComment(postId, getReq(req,'userId'), comment);
        return res.status(httpStatus.OK).send(data);
    };
    fetchComments = async (req: FastifyRequest, res: FastifyReply)=>{
        const {postId, page, limit} = req.params as any
        const data = await this.postService.fetchComments(postId, page, limit);
        return res.status(httpStatus.OK).send(data);
    };
    savePost = async (req: FastifyRequest, res: FastifyReply) => {
        const {postId} = req.params as any;
        const data = await this.postService.savePost(postId, getReq(req, 'userId'));
        return res.status(httpStatus.OK).send(data);
    };
    repost = async (req: FastifyRequest, res: FastifyReply) => {
        const {postId} = req.params as any;
        const data = await this.postService.repost(getReq(req,'userId'), postId);
        return res.status(httpStatus.OK).send(data);
    }
};

export default PostController;