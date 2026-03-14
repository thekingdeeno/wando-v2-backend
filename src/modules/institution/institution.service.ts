import { injectable } from "tsyringe";
import { InstitutonRepository } from "../../repositories/institution.repository";
import { InstitutionPartialType } from "../../model/institution";
import { readFile } from "fs/promises";
import { log } from "console";
@injectable()
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


    async seedInstitutions(start: number = 0, batch: number = 1000){
        try {
            const jsonFile = await readFile('institutions.base.json', 'utf-8')
            const json = JSON.parse(jsonFile)

            let i = start;
            while (i < start + batch) {
                const item = json[i]
                if (!item) return {
                    status: true,
                    data: {index: i, batch, left: json.length - i},
                    message: 'Process Completed'
                }
                const payload: InstitutionPartialType = {
                    name: item.name,
                    domain: item.domains[0],
                    website: item.web_pages[0],
                    country: item.country,
                    countryCode: item.alpha_two_code,
                    city: item['state-province']
                }

                const query = await this.institutionRepo.addInstitution(payload)
                i++
            }

            return {
                status: true,
                data: {index: i, batch, left: json.length - i},
                message: 'Process Completed'
            }
            
        } catch (error: any) {
            console.log(error)
            
            return {
                status: false, message: 'failed to seed institutions'
            }
        }
    }
}

export default InstitutionService