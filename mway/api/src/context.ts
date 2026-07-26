import { PostgresDataSource } from "./datasource";
import { getEnvironmentVariables } from './environment';
import { KoaContextFunctionArgument } from '@as-integrations/koa';

export interface Context {
  dataSource: PostgresDataSource;
  environment: ReturnType<typeof getEnvironmentVariables>;
}

export async function createContext(_: KoaContextFunctionArgument): Promise<Context> {
  return {
    dataSource: new PostgresDataSource(),
    environment: getEnvironmentVariables(),
  }
}