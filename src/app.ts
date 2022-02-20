import { ApolloServer, gql } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import connectdb from './db/Connect';
import PersonModel from './Models/PersonModel';
const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
  }
  type Query {
    getPerson(id: ID): Person
    getAllPersons: [Person]
  }
  input addPersonInput {
    firstName: String!
    lastName: String!
  }
  type Mutation {
    addPerson(input: addPersonInput): String
    updatePerson(id: ID, input: addPersonInput): String
    deletePerson(id: ID): String
  }
`;
const resolvers = {
  Query: {
    getAllPersons: async () => {
      const persons = await PersonModel.find();
      return persons;
    },
    getPerson: async (
      parent: any,
      args: { id: String },
      context: any,
      info: any
    ) => {
      const { id } = args;
      const person = await PersonModel.findById(id);
      return person;
    },
  },
  Mutation: {
    addPerson: async (_: any, { input }: { input: any }) => {
      const person = new PersonModel(input);
      await person.save();
      return 'Person added';
    },
    updatePerson: async (_: any, { id, input }: { id: String; input: any }) => {
      const person = await PersonModel.findByIdAndUpdate(id, input);
      return 'Person updated';
    },
    deletePerson: async (_: any, { id }: { id: String }) => {
      const person = await PersonModel.findByIdAndDelete(id);
      return 'Person deleted';
    },
  },
};

(async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  await connectdb();
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
})();
