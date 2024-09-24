const DB_HOST = process.env.DB_HOST ?? "localhost"
const DB_USERNAME = process.env.DB_USERNAME ?? ""
const DB_PASSWORD = process.env.DB_PASSWORD

export const pgGodCredentials = {
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
}

export function getDatabaseURL(dbName): string {
  return `postgres://${DB_USERNAME}${
    DB_PASSWORD ? `:${DB_PASSWORD}` : ""
  }@${DB_HOST}/${dbName}`
}
