import { Router } from 'express';
import { createAccount } from '../controllers/account/create-account.js';

export const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World! @ acc');
});

router.post('/create', (req, res) => {
  createAccount(req, res);
  });

export default router;
