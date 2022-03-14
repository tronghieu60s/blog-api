import cors from "cors";
import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import logger from "morgan";
import { sendResponseError } from "./src/helpers/commonFuncs";
import authRouter from "./src/routers/authRouter";
import postsRouter from "./src/routers/postsRouter";
import usersRouter from "./src/routers/usersRouter";
import { ResponseError } from "./src/types/common";

const app: Express = express();
const {
  PORT = 3000,
  NODE_ENV,
  MONGODB_URI,
  APP_TOKEN_JWT_KEY = "",
} = process.env;

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
app.use((req, res, next) => {
  if (req.url === "/auth" || req.url === "/register") {
    return next();
  }

  const token = req.headers?.authorization || "Empty";
  jwt.verify(token, APP_TOKEN_JWT_KEY, function (err, decoded) {
    if (err) {
      return sendResponseError(res, { status: 401, message: "Unauthorized" });
    }
    if (decoded) {
      if ((decoded as any).outdated < Date.now()) {
        return sendResponseError(res, { status: 403, message: "Forbidden" });
      }
      return next();
    }
  });
});

app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ status: 200, message: "OK!" });
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
