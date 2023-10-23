import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

import accountRouter from "./routes/account.js";
import analyticRouter from "./routes/analytic.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(helmet());
app.use(bodyParser.json());

app.use("/account", accountRouter);
app.use("/analytic", analyticRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
