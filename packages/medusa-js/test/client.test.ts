import { config } from "process"
import Medusa, { Client } from "../src/index"

describe("Medusa Client", () => {
  test("Can set client as part of config", () => {
    const config = {
      apiKey: "234",
      baseUrl: "http://example.com",
      maxRetries: 1,
    }
    const client = new Client(config)
    const medusa = new Medusa(config, client)
  })
})
