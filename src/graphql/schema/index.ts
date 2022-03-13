const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: () => ({}),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({}),
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
