import { loadDatabaseConfig } from "../load-database-config"

describe("loadDatabaseConfig", function () {
  it("should throw if no clientUrl is provided", function () {
    let error
    try {
      loadDatabaseConfig({})
    } catch (e) {
      error = e
    }

    expect(error.message).toEqual(
      "No database clientUrl provided. Please provide the clientUrl through the PRODUCT_POSTGRES_URL or POSTGRES_URL environment variable or the options object in the initialize function."
    )
  })
})
