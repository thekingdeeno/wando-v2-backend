import bcrypt from 'bcrypt'
import crypto from 'crypto'

const SALT_ROUNDS = 10;

export const bycryptHashString = async (text: string) => {
    return await bcrypt.hash(text, SALT_ROUNDS);
};

export const bcryptCompareHashedString = async (plainText: string, hashedText: string) => {
    return await bcrypt.compare(plainText, hashedText);
};
export const encryptTextWithKey = ({ string, algorithm = 'aes-256-cbc', salt = 'xxx' }: any) => {
    try {
      const iv = crypto.randomBytes(16);
      const key = crypto.pbkdf2Sync(string, salt, 1000, 32, 'sha512');
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
      let encrypted = cipher.update(string, 'utf8', 'base64');
      return encrypted + cipher.final('base64');
    } catch (e) {
      console.log(`encryptTextWithKey[ERROR]:===>`, e);
    //   throw new AppError(httpStatus.OK, e);
    }
  };
  
  export const decryptTextWithKey = ({ string, algorithm = 'AES-128-ECB', salt = '' }: any) => {
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(string, salt, 1000, 32, 'sha512');
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(string, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  };