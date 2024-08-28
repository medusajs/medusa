/*
|--------------------------------------------------------------------------
| PostgreSQL utilities
|--------------------------------------------------------------------------
|
| @note
| These utlities does not rely on an MedusaJS application and neither
| uses the Mikro ORM.
| The goal here is to run DB operations without booting the application.
|
| For example:
| Creating a database from CLI, or checking if a database exists
|
*/

import { Client, type ClientConfig } from "pg"
import { parse } from "pg-connection-string"

/**
 * Parsers the database connection string into an object
 * of postgreSQL options
 */
export function parseConnectionString(connectionString: string) {
  return parse(connectionString)
}

/**
 * Creates a PostgreSQL database client using the connection
 * string or database options
 */
export function createClient(options: string | ClientConfig) {
  return new Client(options)
}

/**
 * Creates a database using the client. Make sure to call
 * `client.connect` before using this utility.
 */
export async function createDb(client: Client, databaseName: string) {
  await client.query(`CREATE DATABASE "${databaseName}"`)
}

/**
 * Checks if a database exists using the Client.  Make sure to call
 * `client.connect` before using this utility.
 */
export async function dbExists(client: Client, databaseName: string) {
  const result = await client.query(
    `SELECT datname FROM pg_catalog.pg_database WHERE datname='${databaseName}';`
  )
  return !!result.rowCount
}
