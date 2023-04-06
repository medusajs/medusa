export const typeormConfig = {
  type: process.env.TYPEORM_CONNECTION,
  url: process.env.TYPEORM_URL,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  migrations: [process.env.TYPEORM_MIGRATIONS as string],
  entities: [process.env.TYPEORM_ENTITIES],
  logging: true,
}
