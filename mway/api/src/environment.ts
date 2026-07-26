import { ok } from 'assert';

export function requireEnvironmentVariables() {
  ok(process.env.POSTGRES_HOST);
  ok(process.env.POSTGRES_PORT);
  ok(process.env.POSTGRES_USER);
  ok(process.env.POSTGRES_PASSWORD);
  ok(process.env.POSTGRES_DB);
}

export function getEnvironmentVariables() {
  return {
    POSTGRES_HOST: process.env.POSTGRES_HOST!,
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT),
    POSTGRES_USER: process.env.POSTGRES_USER!,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
    POSTGRES_DATABASE: process.env.POSTGRES_DB!,
  }
}
