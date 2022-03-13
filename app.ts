import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";
import usersRouter from './src/routers/usersRouter';
import { ErrorResponse } from "./types";

dotenv.config();

const app: Express = express();
const { PORT = 3000, NODE_ENV, MONGODB_URI } = process.env;

/* Middleware */
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* MongoDB */
const MONGODB_URL_LOCAL = `mongodb://localhost/mongo`;
mongoose
  .connect(MONGODB_URI || MONGODB_URL_LOCAL, {})
  .then(() => console.log("✔️ Connected To Database Successfully!"))
  .catch((err: Error) =>
    console.log(`❌ Failed To Connect To Database!\n ${err}`)
  );

/* Graphql */
const { graphqlHTTP } = require("express-graphql");
const schemaGraphQL = require("./src/graphql/schema");
const resolversGraphQL = require("./src/graphql/resolvers");
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaGraphQL,
    rootValue: resolversGraphQL,
    graphiql: NODE_ENV === "development",
  })
);

/* Routers */
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ status: 200, message: "OK!" });
});

app.use((req: Request, res: Response, next) => {
  const status = 404;
  const error = new Error("Not Found");
  next({ status, error });
});

app.use(
  (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.error.message || "Internal Server Error";
    return res.status(status).json({ status, message });
  }
);

/* Listen Port */
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}/`)
);
