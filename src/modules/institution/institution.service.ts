import { injectable } from "tsyringe";
import { InstitutonRepository } from "../../repositories/institution.repository";

class InstitutionService {
    constructor(
        private readonly institutionRepo: InstitutonRepository
    ){}

    async fetchInstitution(id: string){
        try {
            const data = await this.institutionRepo.findInstitutionById(id);
            return {
                status: true,
                message: 'Institution Fetched Successfully',
                data
            }
        } catch (error: any) {
            console.log(error)
            return {
                status: false, message: 'failed to fetch institution'
            }
        }
    }

    async fetchInstitutions(page?: number, number?: number){
        try {
            const data = await this.institutionRepo.fetchInstitutions(page, number);
            return{
                status: true,
                mesasge: 'Institutions fetch successfully'
            }
        } catch (error: any) {
            console.log(error)
            return {
                status: false, message: 'failed to fetch institutions'
            };
        };
    };

    
}

export default InstitutionService