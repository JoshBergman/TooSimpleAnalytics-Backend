import { Router } from 'express';

export const router = Router();

router.get('/', (req, res) => {
  res.send('Hello World! @ analytic');
});

export default router;
