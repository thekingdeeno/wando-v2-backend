import { Institution, InstitutionModel, InstitutionPartialType, InstitutionI } from "../model/institution";
import { BaseRepository } from "./base.repository";

export class InstitutonRepository extends BaseRepository<Institution, InstitutionI> {
    constructor(){
        super(InstitutionModel);
    };

    async addInstitution(payload: InstitutionPartialType): Promise<Institution>{
        return await new InstitutionModel(payload).save();
    }

    async fetchInstitutions(page = 1, limit= 100){
        return await InstitutionModel.find().skip((page -1) * limit).limit(limit);
    }

    async findInstitutionById(institutionId: string){
        return await InstitutionModel.findById(institutionId)
    }
}