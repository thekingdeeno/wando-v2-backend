import { injectable } from "tsyringe"

@injectable()
class RegistrationService {

    async registerUser(payload: any){
        console.log(payload)
    }
}

export default RegistrationService