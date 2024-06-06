import { loadDatabaseConfig } from "../load-module-database-config"

describe("loadDatabaseConfig", function () {
  afterEach(() => {
    delete process.env.POSTGRES_URL
    delete process.env.MEDUSA_POSTGRES_URL
    delete process.env.PRODUCT_POSTGRES_URL
  })

  it("should return the local configuration using the environment variable respecting their precedence", function () {
    process.env.MEDUSA_POSTGRES_URL = "postgres://localhost:5432/medusa"
    process.env.PRODUCT_POSTGRES_URL = "postgres://localhost:5432/product"
    process.env.POSTGRES_URL = "postgres://localhost:5432/share_db"

    let config = loadDatabaseConfig("product")

    expect(config).toEqual({
      clientUrl: process.env.PRODUCT_POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })

    delete process.env.PRODUCT_POSTGRES_URL
    config = loadDatabaseConfig("product")

    expect(config).toEqual({
      clientUrl: process.env.MEDUSA_POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })

    delete process.env.MEDUSA_POSTGRES_URL
    config = loadDatabaseConfig("product")

    expect(config).toEqual({
      clientUrl: process.env.POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should return the remote configuration using the environment variable", function () {
    process.env.POSTGRES_URL = "postgres://https://test.com:5432/medusa"
    let config = loadDatabaseConfig("product")

    expect(config).toEqual({
      clientUrl: process.env.POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      debug: false,
      schema: "",
    })

    delete process.env.POSTGRES_URL
    process.env.PRODUCT_POSTGRES_URL = "postgres://https://test.com:5432/medusa"
    config = loadDatabaseConfig("product")

    expect(config).toEqual({
      clientUrl: process.env.PRODUCT_POSTGRES_URL,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should return the local configuration using the options", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl: "postgres://localhost:5432/medusa-test",
      },
    }

    let config = loadDatabaseConfig("product", options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should return the remote configuration using the options", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl: "postgres://https://test.com:5432/medusa-test",
      },
    }

    let config = loadDatabaseConfig("product", options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should return the local configuration using the client url ssl_mode=disable", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl:
          "postgres://https://test.com:5432/medusa-test?ssl_mode=disable",
      },
    }

    let config = loadDatabaseConfig("product", options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should return the remote configuration using the client url ssl_mode=false", function () {
    process.env.POSTGRES_URL = "postgres://localhost:5432/medusa"
    const options = {
      database: {
        clientUrl:
          "postgres://https://test.com:5432/medusa-test?ssl_mode=disable",
      },
    }

    let config = loadDatabaseConfig("product", options)

    expect(config).toEqual({
      clientUrl: options.database.clientUrl,
      driverOptions: {
        connection: {
          ssl: false,
        },
      },
      debug: false,
      schema: "",
    })
  })

  it("should throw if no clientUrl is provided", function () {
    let error
    try {
      loadDatabaseConfig("product")
    } catch (e) {
      error = e
    }

    expect(error.message).toEqual(
      "No database clientUrl provided. Please provide the clientUrl through the [MODULE]_POSTGRES_URL, MEDUSA_POSTGRES_URL or POSTGRES_URL environment variable or the options object in the initialize function."
    )
  })
})
