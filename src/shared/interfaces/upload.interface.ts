import { Document } from "mongoose";

export interface IUpload extends Document {
  userId: string;
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
  folder: string;
  format?: string;
  width?: number;
  height?: number;
  size?: number;
  tags?: string[];
}