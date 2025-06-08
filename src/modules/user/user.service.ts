import { injectable } from "tsyringe";
import { UserRepository } from "../../repositories/user.repository";
import httpStatus from "http-status";
import { User, UserPartialType } from "../../model/users";
import UploadService from "../../shared/services/cloud-storage.service";
import { UploadRepository } from "../../repositories/upload.repository";

@injectable()
class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly uploadService: UploadService,
        private readonly uploadRepository: UploadRepository
    ){};

    async fetchUserById (userId: string){
        try {
            const user = await this.userRepo.findUserById(userId, true);
            if (!user) throw new Error('User not found');
            return{
                status: true,
                data: user,
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
            const data: any = await this.uploadService.uploadMedia(userId,'cloudinary', 'pfp', {
                file: img.buffer,
                fileName: userId,
                filePath: 'pfp'
            });

            await this.userRepo.updateByUserId(userId, {avatar: data.record.url})
            await this.uploadRepository.deleteOldPfp(userId, data.record.uploadId);
            
            return{
                status: true,
                message: 'User PFP updated succeffully'
            }
        } catch (error) {
            console.log(error.message)
            return {status: false, statusCode: httpStatus.BAD_REQUEST, message: error.message};
        }
    }

    async fetchFollowers (userId: string, page: number, limit: number){
        try {
            const data = await this.userRepo.fetchFollowers(userId, page, limit);
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

    async fetchFollowing (userId: string, page: number, limit: number){
        try {
            const data = await this.userRepo.fetchFollowing(userId, page, limit);
            return{
                status: true,
                data,
                message: 'User Following List'
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
            const findFollowd = await this.userRepo.findUserById(followedId)
            if (!findFollowd) {
                return {status: false, message: "Cannot find this user to follow"}
            }
            const inFollowing = await this.userRepo.findInFollowing(userId, followedId)
            if (inFollowing === 1) {
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