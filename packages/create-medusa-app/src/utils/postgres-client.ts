import pg from "pg"
const { Client } = pg

type PostgresConnection = {
  user?: string
  password?: string
  connectionString?: string
  database?: string
}

export default async (connect: PostgresConnection) => {
  const client = new Client(connect)

  await client.connect()

  return client
}
