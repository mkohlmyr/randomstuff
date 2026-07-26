import { DateTimeResolver } from 'graphql-scalars';
import { Context } from './context';
import { Resolvers } from './schema';
import { readFileSync} from 'fs';
import { resolve } from 'path';

export const typeDefs = readFileSync(resolve(__dirname, '..', 'resources', 'schema.graphql'), 'utf8');

export const resolvers: Resolvers<Context> = {
  DateTime: DateTimeResolver,
  Query: {
    async vehicleState(_, args, { dataSource }) {
      // If no point in time "at" is passed in, assume we 
      // want the current state of the vehicle.
      // 
      return dataSource.getVehicleStatus(
        args.id, 
        args.at ? new Date(args.at) : new Date()
      );
    },
  }
};