const cors = require("cors");
const logger = require("morgan");
const express = require("express");

const app = express();
const { PORT = 3000, NODE_ENV, MONGODB_URI } = process.env;

/* Middleware */
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* MongoDB */
const mongoose = require("mongoose");
const MONGODB_URL_LOCAL = `mongodb://localhost/mongo`;
mongoose
  .connect(MONGODB_URI || MONGODB_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✔️ Connected To Database Successfully!"))
  .catch((err) => console.log(`❌ Failed To Connect To Database!\n ${err}`));

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

/* Listen Port */
app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}/`)
);
