import { injectable } from "tsyringe";
import { UserRepository } from "../../repositories/user.repository";
import httpStatus from "http-status";
import { User, UserPartialType } from "../../model/users";
import UploadService from "../../shared/services/cloud-storage.service";

@injectable()
class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly uploadService: UploadService
    ){};

    async fetchUserById (userId: string){
        try {
            const user = await this.userRepo.findUserById(userId, true);
            const followers = await this.userRepo.fetchFollowersCount(userId);
            const following = await this.userRepo.fetchFollowingCount(userId)

            if (!user) throw new Error('User not found');
            return{
                status: true,
                data: {user, followersCount: followers[0].count, followingCount: following[0].count},
                message: 'User Found'
            };

        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        };
    }

    async updateUser (userId: string, payload: UserPartialType){
        try {
            const {acknowledged} = await this.userRepo.updateByUserId(userId, payload)
            if (!acknowledged) throw new Error('Failed to update user Record');
            return{
                status: true,
                message: 'User Updated Successfully'
            };
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }

    async updatePfp (userId: string, img: any){
        try {
            const data: any = await this.uploadService.uploadMedia('cloudinary', {
                file: img.buffer,
                fileName: userId,
                filePath: 'pfp'
            });

            await this.userRepo.updateByUserId(userId, {avatar: data.record.url})
            
            return{
                status: true,
                message: 'User PFP updated succeffully'
            }
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }

    async fetchFollowers (userId: string){
        try {
            const data = await this.userRepo.fetchFollowers(userId);
            return{
                status: true,
                data,
                message: 'User Followers List'
            };
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }

    async followUser(userId: string, followedId: string){
        try {
            if (userId === followedId) {
                return{status: false, message: "Cannot follow yourself"};
            }
            const check = await this.userRepo.findInFollowing(userId, followedId)
            if (check === 1) {
                return{status: false, message: "Already following this user"};
            }
            const data = await this.userRepo.followUser(userId, followedId);
            console.log(data);
            
            return{
                status: true,
                message: 'Action Successfull'
            };
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }

}

export default UserService;