import ora, { Ora } from "ora"
import runCreateDb from "../create-db.js"
import pg from "pg"
import { nanoid } from "nanoid"
import formatConnectionString from "../format-connection-string.js"

const dbName = `medusa-${nanoid(4)}`
const spinner: Ora = ora()

describe("create-db", () => {
  afterEach(async () => {
    const client = new pg.Client({
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || ""
    })

    await client.connect()

    await client.query(`DROP DATABASE IF EXISTS "${dbName}"`)

    await client.end()
  })

  it("should create local db", async () => {
    expect.assertions(1)
    const client = new pg.Client({
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || ""
    })
    await client.connect()

    let newClient = await runCreateDb({
      client,
      dbName,
      spinner
    })

    const connectionString = formatConnectionString({
      user: newClient.user,
      password: newClient.password,
      host: newClient.host,
      db: dbName
    })

    await newClient.end()

    newClient = new pg.Client({
      connectionString
    })

    return expect((async () => {
      await newClient.connect()

      await newClient.end()
    })()).resolves.toBeUndefined()
  })
  
})