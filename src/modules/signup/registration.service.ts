import "reflect-metadata"
import { container, injectable } from "tsyringe"
import { UserRepository } from "../../repositories/user.repository"
import { ObjectLiteral } from "../../shared/types/general.type"
@injectable()
class RegistrationService {
    constructor(
        private readonly userRepo: UserRepository
    ){}

    async registerUser(payload: ObjectLiteral){
        try {
            const newUser = await this.userRepo.createUser(payload);
            return{
                status: true,
                message: 'User created successfuly',
                data: newUser,
            }
        } catch (err: any) {
            console.log(err);
        }
    }
}

export default RegistrationService