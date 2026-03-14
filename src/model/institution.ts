import { Document, Schema, SchemaTypes, model, Model } from "mongoose"

export interface Institution {
    institutionId: string,
    institutionType: string,
    name: string
    website: string,
    domain: string,
    country: string,
    countryCode: string,
    city: string
}

export interface InstitutionI extends Institution,Document  {}

const InstitutionSchema = new Schema ({
    institutionId: {type: String},
    institutionType: {type: String},
    name: {type: String},
    website: {type: String},
    domain: {type: String},
    country: {type: String},
    countryCode: {type: String},
    city: {type: String},
})

InstitutionSchema.pre('save', async function(){
    this.institutionId = this._id.toString();
});

export const InstitutionModel: Model<InstitutionI> = model<InstitutionI>('institution', InstitutionSchema);

export interface InstitutionPartialType extends Partial<Institution> {};