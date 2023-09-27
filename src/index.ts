// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';

import accountRouter from './routes/account.js'
import analyticRouter from './routes/analytic.js'

dotenv.config();

const app = express();
app.use(helmet());

app.use(accountRouter);
app.use(analyticRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
