import pg from "pg"
const { Client } = pg

export const DEFAULT_HOST = "localhost"
export const DEFAULT_PORT = 5432

type PostgresConnection = {
  user?: string
  password?: string
  connectionString?: string
  database?: string
  host?: string
  port?: number
}

export default async (connect: PostgresConnection) => {
  const client = new Client(connect)

  await client.connect()

  return client
}
