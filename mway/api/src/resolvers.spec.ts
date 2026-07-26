import { ApolloServer } from '@apollo/server';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import assert from 'assert';
import { resolvers, typeDefs } from './resolvers';
import { Context } from './context';
import { Query } from './schema';

const mockApolloServer = (mockedResolvers?: typeof resolvers) => {
  if (!mockedResolvers) {
    return new ApolloServer<Context>({
      schema: addMocksToSchema({
        schema: makeExecutableSchema({
          typeDefs,
          resolvers
        })
      })
    });
  } else {
    // In future we would have tests which do not return 
    // randomised data, for these we would use a passed 
    // in mock to test that resovlers are exercised.
    // 
    return new ApolloServer<Context>({
      typeDefs,
      resolvers: mockedResolvers
    });
  }
};

describe(`Query`, () => {
  describe(`vehicleState`, () => {
    it(`should return a vehicle according to schema`, async () => {
      const server = mockApolloServer();
      const response = await server.executeOperation<Query>({
        query: `
          query GetVehicleState($id: Int!) {
            vehicleState(id: $id) {
              id
              make
              model
              state
            }
          }
        `, 
        variables: {
          id: 1
        }
      });

      // Use node assert to narrow the type.
      assert(response.body.kind === 'single');
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data).toBeDefined();

      const actual = response.body.singleResult.data;

      expect(actual!.vehicleState).toBeDefined();
      expect(actual!.vehicleState!.id).toEqual(expect.any(Number));
      expect(actual!.vehicleState!.make).toEqual(expect.any(String));
      expect(actual!.vehicleState!.model).toEqual(expect.any(String));
      expect(actual!.vehicleState!.state).toEqual(expect.any(String));
    });
  })
});