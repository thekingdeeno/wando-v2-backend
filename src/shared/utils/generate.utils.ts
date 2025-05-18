import { randomUUID } from "crypto";
import randomatic from "randomatic";

export const genNumber = (digits: number) => {
    const numString = randomatic('0', digits);
    const number = parseInt(numString);
    return number;
}

export const genAlphaString = (length: number, caps?: boolean) => {
    return randomatic(`${caps?'A':'a'}`, length);
}

export const genAlphaNum = (length: number) => {
    return randomatic('Aa0', length)
}

export const genUUID = () => {
    const uuid = randomUUID();
    return uuid;
}