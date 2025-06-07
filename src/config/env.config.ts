import { convertStringToBoolean } from "../shared/utils/boolean.utils";

export const app = {
    name: process.env.APP_NAME,
    brand: process.env.BRAND_NAME,
    isProduction: process.env.NODE_ENV === 'production',
    productionBaseUrl: process.env.PORDUCTION_BASE_URL
};

export const server = {
    port: Number(process.env.PORT) || 8080,
    address: process.env.SERVER_ADDRESS || '0.0.0.0',
    bodyParserSize: process.env.BODY_PARSER_SIZE,
};

export const database = {
    connection: {
      host: process.env.MONGODB_HOST,
      database: process.env.MONGODB_DATABASE as string,
      user: process.env.MONGODB_USERNAME as string,
      password: process.env.MONGODB_PASSWORD as string,
      port: process.env.MONGODB_PORT || undefined,
      srv: process.env.MONGODB_SRV || false
    },
    pool: {
      min: parseInt(process.env.DB_POOL_MIN as string) || 1,
      max: parseInt(process.env.DB_POOL_MAX as string) || 25,
    }
  };

  export const redis = {
    user: process.env.REDIS_USER,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };

  export const mailer = {
    from: process.env.SMTP_FROM as string,
    service: process.env.SMTP_SERVICE as string,
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    secure: convertStringToBoolean(process.env.SMTP_SECURE as string),
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASSWORD as string,
    },
  };

  export const gcp = {
    project_id: process.env.GCP_PROJECT_ID,
    stagingkeyFilenamePath: String(process.env.STAGING_KEYFILENAME_PATH),
    serviceAccount: process.env.GCP_SERVICE_ACCOUNT,
    bucketName: process.env.GCP_BUCKET_NAME,
  };

  export const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }