import http from "http";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { koaMiddleware } from "@as-integrations/koa";
import isPortReachable from 'is-port-reachable';
import { Context, createContext } from './context';
import { resolvers, typeDefs } from './resolvers';
import { requireEnvironmentVariables } from './environment';


;(async () => {
  requireEnvironmentVariables();
  
  await isPortReachable(5432, { host: process.env.POSTGRES_HOST! });
  const app = new Koa();
  const httpServer = http.createServer(app.callback());
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(cors());
  app.use(bodyParser());
  app.use(
    koaMiddleware(
      server,
      {
        context: createContext,
      }
    )
  );

  httpServer.listen({ port: 8080 }, () => {
    console.log(`🚀 Server ready at http://localhost:8080`);
  });
})();

