import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';


export interface Upload {
    uploadId: string,
    category: string,
    fileType: string,
    fileFormat: string,
    host: string,
    path: string,
    url: string,
    fileName: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface UploadI extends Upload, Document {}

const UploadSchema = new Schema({
    uploadId: {type: String},
    category: {type: String},
    fileType: {type: String},
    fileFormat: {type: String},
    host: {type: String},
    path: {type: String},
    url: {type: String},
    fileName: {type: String},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true},
    updatedAt: {type: Date, default: ()=> Date.now()},
})

UploadSchema.pre('save', async function(){
    this.uploadId = this._id.toString()
});

export const UploadModel: Model<UploadI> = model<UploadI>("uploads", UploadSchema);

export interface UploadPartialType extends Partial<Upload> {};