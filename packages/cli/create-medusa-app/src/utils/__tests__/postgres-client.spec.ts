import postgresClient from "../postgres-client.js"

describe("postgres-client", () => {
  it("should retrieve a connected client", async () => {
    expect.assertions(1)
    return expect((async () => {
      const client = await postgresClient({})

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