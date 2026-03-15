import { Field } from "multer";
import { Institution, InstitutionModel, InstitutionPartialType, InstitutionI } from "../model/institution";
import { BaseRepository } from "./base.repository";

export class InstitutonRepository extends BaseRepository<Institution, InstitutionI> {
    constructor(){
        super(InstitutionModel);
    };

    async addInstitution(payload: InstitutionPartialType): Promise<Institution>{
        return await new InstitutionModel(payload).save();
    }

    async fetchInstitutions( queries: object = {}, page = 1, limit= 100){
        const filtersTypes = ['institutionType', 'name', 'country', 'countryCode', 'city']
        if (queries){
            const queryKeys = Object.keys(queries);
            for (const key of queryKeys) {
                if (!filtersTypes.includes(key)) return {status: false, message: `Invalid filter type ${key}`};
            }
        }
        return await InstitutionModel.find(queries?? {}).skip((page -1) * limit).limit(limit);
    }

    async findInstitutionById(institutionId: string){
        return await InstitutionModel.findById(institutionId)
    }
}