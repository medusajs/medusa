import postgresClient from "../postgres-client.js"

describe("postgres-client", () => {
  it("should retrieve a connected client", async () => {
    expect.assertions(1)
    return expect((async () => {
      const client = await postgresClient({
        user: process.env.POSTGRES_USER || "postgres",
        password: process.env.POSTGRES_PASSWORD || "",
        host: process.env.POSTGRES_HOST || "localhost",
        port: parseInt(process.env.POSTGRES_PORT || "5432")
      })

      await client.end()
    })()).resolves.toBeUndefined()
  })

  it("shouldn't connect to database", async () => {
    expect.assertions(1)
    return expect((async () => {
      await postgresClient({
        user: "test",
        password: "test"
      })
    })()).rejects.toThrow()
  })
})