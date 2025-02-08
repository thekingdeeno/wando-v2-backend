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