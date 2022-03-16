import cors from "cors";
import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";
import { basicAuthorization, sendResponseError } from "./src/helpers/commonFuncs";
import { ResponseError } from "./src/helpers/commonTypes";
import authRouter from "./src/routers/authRouter";
import commentsRouter from "./src/routers/commentsRouter";
import postsRouter from "./src/routers/postsRouter";
import usersRouter from "./src/routers/usersRouter";

const app: Express = express();
const {
  PORT = 3000,
  NODE_ENV,
  MONGODB_URI,
} = process.env;

/* Middleware */
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(basicAuthorization);

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
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ status: 200, message: "OK!" });
});

app.get("/500", () => {
  throw {};
});

app.use((req: Request, res: Response, next) => {
  const status = 404;
  const errors = new Error("Not Found");
  next({ status, errors });
});

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    const { status = 500, errors = err } = err;
    const message = errors?.message || "Internal Server Error";
    return sendResponseError(res, { status, message, errors });
  }
);

/* Listen Port */
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}/`)
);
