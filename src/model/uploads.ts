import { Document, Schema, SchemaTypes, model, Model } from 'mongoose';


export interface Upload {
    uploadId: string,
    uploader: string,
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
    uploader: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    category: {type: String, required: true},
    fileType: {type: String},
    fileFormat: {type: String},
    host: {type: String, required: true,},
    path: {type: String, required: true,},
    url: {type: String, required: true,},
    fileName: {type: String},
    createdAt: {type: Date, default: ()=> Date.now(), immutable: true},
    updatedAt: {type: Date, default: ()=> Date.now()},
})

UploadSchema.pre('save', async function(){
    this.uploadId = this._id.toString()
});

export const UploadModel: Model<UploadI> = model<UploadI>("uploads", UploadSchema);

export interface UploadPartialType extends Partial<Upload> {};