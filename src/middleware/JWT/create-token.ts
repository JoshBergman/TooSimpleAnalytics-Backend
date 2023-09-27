import crypto from 'crypto';
import dotenv from 'dotenv';

interface ITokenPayload {
    id: string;
    email: string;
};

dotenv.config();

export const createToken = (payload: ITokenPayload) => {
    const key = process.env.SECRET_KEY;
    if(!key) {
        throw new Error('No Key Found @ Create-Token');
    }

    const encodedHeader = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString('base64');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    const signature = crypto.createHmac('sha256', key)
    .update(encodedHeader + "." + encodedPayload)
    .digest('base64');

    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    return token;
};