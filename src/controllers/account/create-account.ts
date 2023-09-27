import { Request, Response } from 'express';
import { createToken } from '../../middleware/JWT/create-token.js';
import { generateId } from '../../helpers/make-id.js';

export const createAccount = (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    const userID = generateId();

    const token = createToken({ id: userID, email: email });
    res.send({userID, token});
};