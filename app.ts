import cors from "cors";
import "dotenv/config";
import express, { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";
import { ResponseError } from "./src/common/types";
import {
  authorizationByToken,
  sendResponseError,
} from "./src/helpers/commonFuncs";
import router from "./src/routers";

const app: Express = express();
const { PORT = 3000, NODE_ENV, MONGODB_URI } = process.env;

/* Middleware */
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(process.cwd() + "/public"));

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
app.use("/api", authorizationByToken, router);
app.get("/api/500", () => {
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
