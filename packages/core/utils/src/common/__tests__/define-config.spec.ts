import { Modules } from "../../modules-sdk"
import { DEFAULT_STORE_RESTRICTED_FIELDS, defineConfig } from "../define-config"

describe("defineConfig", function () {
  it("should merge empty config with the defaults", function () {
    expect(defineConfig()).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include auth mfa encryption key when configured", function () {
    const originalEnv = { ...process.env }
    process.env.AUTH_MFA_ENCRYPTION_KEY = "test-mfa-key"

    let config!: ReturnType<typeof defineConfig>
    try {
      config = defineConfig()
    } finally {
      process.env = { ...originalEnv }
    }

    expect(config.modules?.[Modules.AUTH]).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          mfa: {
            encryption_key: "test-mfa-key",
          },
        }),
      })
    )
  })

  it("should include auth mfa encryption key when auth options are customized", function () {
    const originalEnv = { ...process.env }
    process.env.AUTH_MFA_ENCRYPTION_KEY = "test-mfa-key"

    let config!: ReturnType<typeof defineConfig>
    try {
      config = defineConfig({
        modules: [
          {
            resolve: "@zjedene-medusa/medusa/auth",
            options: {
              providers: [
                {
                  resolve: "@zjedene-medusa/medusa/auth-emailpass",
                  id: "emailpass",
                  options: {
                    require_verification: true,
                  },
                },
              ],
            },
          },
        ],
      })
    } finally {
      process.env = { ...originalEnv }
    }

    expect(config.modules?.[Modules.AUTH]).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          mfa: {
            encryption_key: "test-mfa-key",
          },
          providers: [
            {
              resolve: "@zjedene-medusa/medusa/auth-emailpass",
              id: "emailpass",
              options: {
                require_verification: true,
              },
            },
          ],
        }),
      })
    )
  })

  it("should include auth mfa encryption key when object-style auth options are customized", function () {
    const originalEnv = { ...process.env }
    process.env.AUTH_MFA_ENCRYPTION_KEY = "test-mfa-key"

    let config!: ReturnType<typeof defineConfig>
    try {
      config = defineConfig({
        modules: {
          auth: {
            options: {
              providers: [
                {
                  resolve: "@zjedene-medusa/medusa/auth-emailpass",
                  id: "emailpass",
                  options: {
                    require_verification: true,
                  },
                },
              ],
            },
          },
        },
      })
    } finally {
      process.env = { ...originalEnv }
    }

    expect(config.modules?.[Modules.AUTH]).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          mfa: {
            encryption_key: "test-mfa-key",
          },
          providers: [
            {
              resolve: "@zjedene-medusa/medusa/auth-emailpass",
              id: "emailpass",
              options: {
                require_verification: true,
              },
            },
          ],
        }),
      })
    )
  })

  it("should preserve custom auth mfa encryption key", function () {
    const originalEnv = { ...process.env }
    process.env.AUTH_MFA_ENCRYPTION_KEY = "test-mfa-key"

    let config!: ReturnType<typeof defineConfig>
    try {
      config = defineConfig({
        modules: [
          {
            resolve: "@zjedene-medusa/medusa/auth",
            options: {
              mfa: {
                encryption_key: "custom-mfa-key",
                challenge_ttl_seconds: 600,
              },
            },
          },
        ],
      })
    } finally {
      process.env = { ...originalEnv }
    }

    expect(config.modules?.[Modules.AUTH]).toEqual(
      expect.objectContaining({
        options: expect.objectContaining({
          mfa: {
            encryption_key: "custom-mfa-key",
            challenge_ttl_seconds: 600,
          },
        }),
      })
    )
  })

  it("should merge custom modules", function () {
    expect(
      defineConfig({
        modules: {
          GithubModuleService: {
            resolve: "./modules/github",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleService": {
            "resolve": "./modules/github",
          },
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided", function () {
    expect(
      defineConfig({
        modules: [
          {
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleService": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided with a key to override the module registration name", function () {
    expect(
      defineConfig({
        modules: [
          {
            key: "GithubModuleServiceOverride",
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "GithubModuleServiceOverride": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom project.http config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include disabled modules", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
        modules: {
          [Modules.CART]: false,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "disable": true,
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based modules when in cloud execution context", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@zjedene-medusa/medusa/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/caching-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/caching",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@zjedene-medusa/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@zjedene-medusa/medusa/file-s3",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@zjedene-medusa/medusa/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should use inmemory modules in cloud environment if REDIS_URL is not set", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    delete process.env.REDIS_URL
    delete process.env.CACHE_REDIS_URL
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@zjedene-medusa/medusa/file-s3",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": undefined,
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should include cloud-based config with dynamo db", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@zjedene-medusa/medusa/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/caching-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/caching",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@zjedene-medusa/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@zjedene-medusa/medusa/file-s3",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@zjedene-medusa/medusa/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "id",
              "initialized": true,
              "prefix": "sess:",
              "readCapacityUnits": 5,
              "skipThrowMissingSpecialKeys": true,
              "table": "medusa-sessions",
              "writeCapacityUnits": 5,
            },
          },
        },
      }
    `)
  })

  it("should allow overriding cloud-only dynamodb config values via environment variables", function () {
    const originalEnv = { ...process.env }

    process.env.EXECUTION_CONTEXT = "medusa-cloud"
    process.env.REDIS_URL = "redis://localhost:6379"
    process.env.CACHE_REDIS_URL = "redis://localhost:6379"
    process.env.S3_FILE_URL = "https://s3.amazonaws.com/medusa-cloud-test"
    process.env.S3_PREFIX = "test"
    process.env.S3_REGION = "us-east-1"
    process.env.S3_BUCKET = "medusa-cloud-test"
    process.env.S3_ENDPOINT = "https://s3.amazonaws.com"
    process.env.SESSION_STORE = "dynamodb"
    process.env.DYNAMO_DB_SESSIONS_CREATE_TABLE = "true"
    process.env.DYNAMO_DB_SESSIONS_HASH_KEY = "user_id"
    process.env.DYNAMO_DB_SESSIONS_PREFIX = "my_session:"
    process.env.DYNAMO_DB_SESSIONS_TABLE = "test-sessions"
    process.env.DYNAMO_DB_SESSIONS_READ_UNITS = "10"
    process.env.DYNAMO_DB_SESSIONS_WRITE_UNITS = "10"
    const res = defineConfig({})

    process.env = { ...originalEnv }

    expect(res).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "options": {
              "redisUrl": "redis://localhost:6379",
            },
            "resolve": "@zjedene-medusa/medusa/cache-redis",
          },
          "caching": {
            "options": {
              "providers": [
                {
                  "id": "caching-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/caching-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/caching",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "options": {
              "redisUrl": "redis://localhost:6379",
              "workerOptions": {
                "concurrency": 1,
              },
            },
            "resolve": "@zjedene-medusa/medusa/event-bus-redis",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "s3",
                  "options": {
                    "authentication_method": "s3-iam-role",
                    "bucket": "medusa-cloud-test",
                    "endpoint": "https://s3.amazonaws.com",
                    "file_url": "https://s3.amazonaws.com/medusa-cloud-test",
                    "prefix": "test",
                    "region": "us-east-1",
                  },
                  "resolve": "@zjedene-medusa/medusa/file-s3",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "options": {
              "providers": [
                {
                  "id": "locking-redis",
                  "is_default": true,
                  "options": {
                    "redisUrl": "redis://localhost:6379",
                  },
                  "resolve": "@zjedene-medusa/medusa/locking-redis",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "options": {
              "redis": {
                "url": "redis://localhost:6379",
              },
            },
            "resolve": "@zjedene-medusa/medusa/workflow-engine-redis",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "redisUrl": "redis://localhost:6379",
          "sessionOptions": {
            "dynamodbOptions": {
              "hashKey": "user_id",
              "initialized": false,
              "prefix": "my_session:",
              "readCapacityUnits": 10,
              "skipThrowMissingSpecialKeys": true,
              "table": "test-sessions",
              "writeCapacityUnits": 10,
            },
          },
        },
      }
    `)
  })

  it("should include default plugins", function () {
    const config = defineConfig()
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
    ])
  })

  it("should append custom plugins to defaults", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@zjedene-medusa/custom-plugin", options: { key: "value" } },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
      { resolve: "@zjedene-medusa/custom-plugin", options: { key: "value" } },
    ])
  })

  it("should handle multiple custom plugins", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@zjedene-medusa/plugin-one", options: { setting: "a" } },
        { resolve: "@zjedene-medusa/plugin-two", options: { setting: "b" } },
        { resolve: "./local-plugin", options: {} },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
      { resolve: "@zjedene-medusa/plugin-one", options: { setting: "a" } },
      { resolve: "@zjedene-medusa/plugin-two", options: { setting: "b" } },
      { resolve: "./local-plugin", options: {} },
    ])
  })

  it("should merge plugins", function () {
    const config = defineConfig({
      plugins: [
        { resolve: "@zjedene-medusa/draft-order", options: { setting: "a" } },
      ],
    })
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: { setting: "a" } },
    ])
  })

  it("should include plugins in cloud environment", function () {
    const originalEnv = { ...process.env }
    process.env.EXECUTION_CONTEXT = "medusa-cloud"

    const config = defineConfig({
      plugins: [
        { resolve: "@zjedene-medusa/cloud-plugin", options: { cloud: true } },
      ],
    })

    process.env = { ...originalEnv }

    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
      { resolve: "@zjedene-medusa/cloud-plugin", options: { cloud: true } },
    ])
  })

  it("should handle empty plugins array", function () {
    const config = defineConfig({
      plugins: [],
    })
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
    ])
  })

  it("should handle undefined plugins", function () {
    const config = defineConfig({
      modules: {},
    })
    expect(config.plugins).toEqual([
      { resolve: "@zjedene-medusa/draft-order", options: {} },
    ])
  })

  it("should allow custom dynamodb config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
          sessionOptions: {
            dynamodbOptions: {
              clientOptions: {
                endpoint: "http://localhost:8000",
              },
              table: "medusa-sessions",
              writeCapacityUnits: 25,
              readCapacityUnits: 25,
            },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {
            "dynamodbOptions": {
              "clientOptions": {
                "endpoint": "http://localhost:8000",
              },
              "readCapacityUnits": 25,
              "table": "medusa-sessions",
              "writeCapacityUnits": 25,
            },
          },
        },
      }
    `)
  })

  it("should add cloud options to the project config and relevant modules if the environment variables are set", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_BACKEND_URL = "test-backend-url"
    process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE = "test-environment"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    process.env.MEDUSA_CLOUD_OAUTH_AUTHORIZE_ENDPOINT =
      "test-oauth-authorize-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_TOKEN_ENDPOINT = "test-oauth-token-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_DISABLED = "true"
    const config = defineConfig()
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "test-backend-url",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "callback_url": "test-backend-url/app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": "test-environment",
                "oauth_authorize_endpoint": "test-oauth-authorize-endpoint",
                "oauth_token_endpoint": "test-oauth-token-endpoint",
                "sandbox_handle": undefined,
              },
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-emails-endpoint",
                "environment_handle": "test-environment",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-payments-endpoint",
                "environment_handle": "test-environment",
                "sandbox_handle": undefined,
                "webhook_secret": "test-webhook-secret",
              },
            },
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "test-api-key",
            "emailsEndpoint": "test-emails-endpoint",
            "environmentHandle": "test-environment",
            "oauthAuthorizeEndpoint": "test-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "test-oauth-token-endpoint",
            "paymentsEndpoint": "test-payments-endpoint",
            "sandboxHandle": undefined,
            "webhookSecret": "test-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should add cloud options to the project config and relevant modules if the environment variable is set for a sandbox", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_BACKEND_URL = "test-backend-url"
    process.env.MEDUSA_CLOUD_SANDBOX_HANDLE = "test-sandbox"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    process.env.MEDUSA_CLOUD_OAUTH_AUTHORIZE_ENDPOINT =
      "test-oauth-authorize-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_TOKEN_ENDPOINT = "test-oauth-token-endpoint"
    process.env.MEDUSA_CLOUD_OAUTH_DISABLED = "true"
    const config = defineConfig()
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "test-backend-url",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "callback_url": "test-backend-url/app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": undefined,
                "oauth_authorize_endpoint": "test-oauth-authorize-endpoint",
                "oauth_token_endpoint": "test-oauth-token-endpoint",
                "sandbox_handle": "test-sandbox",
              },
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-emails-endpoint",
                "environment_handle": undefined,
                "sandbox_handle": "test-sandbox",
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "test-api-key",
                "endpoint": "test-payments-endpoint",
                "environment_handle": undefined,
                "sandbox_handle": "test-sandbox",
                "webhook_secret": "test-webhook-secret",
              },
            },
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "test-api-key",
            "emailsEndpoint": "test-emails-endpoint",
            "environmentHandle": undefined,
            "oauthAuthorizeEndpoint": "test-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "test-oauth-token-endpoint",
            "paymentsEndpoint": "test-payments-endpoint",
            "sandboxHandle": "test-sandbox",
            "webhookSecret": "test-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  it("should merge custom projectConfig.cloud", function () {
    const originalEnv = { ...process.env }
    process.env.MEDUSA_CLOUD_ENVIRONMENT_HANDLE = "test-environment"
    process.env.MEDUSA_CLOUD_API_KEY = "test-api-key"
    process.env.MEDUSA_CLOUD_EMAILS_ENDPOINT = "test-emails-endpoint"
    process.env.MEDUSA_CLOUD_PAYMENTS_ENDPOINT = "test-payments-endpoint"
    process.env.MEDUSA_CLOUD_WEBHOOK_SECRET = "test-webhook-secret"
    const config = defineConfig({
      projectConfig: {
        http: {} as any,
        cloud: {
          environmentHandle: "overriden-environment",
          apiKey: "overriden-api-key",
          webhookSecret: "overriden-webhook-secret",
          emailsEndpoint: "overriden-emails-endpoint",
          paymentsEndpoint: "overriden-payments-endpoint",
          oauthAuthorizeEndpoint: "overriden-oauth-authorize-endpoint",
          oauthTokenEndpoint: "overriden-oauth-token-endpoint",
          oauthDisabled: true,
        },
      },
    })
    process.env = { ...originalEnv }

    expect(config).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "/",
          "maxUploadFileSize": 1048576,
          "path": "/app",
        },
        "featureFlags": {},
        "logger": undefined,
        "modules": {
          "api_key": {
            "resolve": "@zjedene-medusa/medusa/api-key",
          },
          "auth": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "callback_url": "//app/login?auth_provider=cloud",
                "disabled": true,
                "environment_handle": "overriden-environment",
                "oauth_authorize_endpoint": "overriden-oauth-authorize-endpoint",
                "oauth_token_endpoint": "overriden-oauth-token-endpoint",
                "sandbox_handle": undefined,
              },
              "mfa": {
                "encryption_key": undefined,
              },
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@zjedene-medusa/medusa/auth-emailpass",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/auth",
          },
          "cache": {
            "resolve": "@zjedene-medusa/medusa/cache-inmemory",
          },
          "cart": {
            "resolve": "@zjedene-medusa/medusa/cart",
          },
          "currency": {
            "resolve": "@zjedene-medusa/medusa/currency",
          },
          "customer": {
            "resolve": "@zjedene-medusa/medusa/customer",
          },
          "event_bus": {
            "resolve": "@zjedene-medusa/medusa/event-bus-local",
          },
          "file": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@zjedene-medusa/medusa/file-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@zjedene-medusa/medusa/fulfillment-manual",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/fulfillment",
          },
          "inventory": {
            "resolve": "@zjedene-medusa/medusa/inventory",
          },
          "locking": {
            "resolve": "@zjedene-medusa/medusa/locking",
          },
          "notification": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "endpoint": "overriden-emails-endpoint",
                "environment_handle": "overriden-environment",
                "sandbox_handle": undefined,
              },
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@zjedene-medusa/medusa/notification-local",
                },
              ],
            },
            "resolve": "@zjedene-medusa/medusa/notification",
          },
          "order": {
            "resolve": "@zjedene-medusa/medusa/order",
          },
          "payment": {
            "options": {
              "cloud": {
                "api_key": "overriden-api-key",
                "endpoint": "overriden-payments-endpoint",
                "environment_handle": "overriden-environment",
                "sandbox_handle": undefined,
                "webhook_secret": "overriden-webhook-secret",
              },
            },
            "resolve": "@zjedene-medusa/medusa/payment",
          },
          "pricing": {
            "resolve": "@zjedene-medusa/medusa/pricing",
          },
          "product": {
            "resolve": "@zjedene-medusa/medusa/product",
          },
          "promotion": {
            "resolve": "@zjedene-medusa/medusa/promotion",
          },
          "rbac": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/rbac",
          },
          "region": {
            "resolve": "@zjedene-medusa/medusa/region",
          },
          "sales_channel": {
            "resolve": "@zjedene-medusa/medusa/sales-channel",
          },
          "settings": {
            "resolve": "@zjedene-medusa/medusa/settings",
          },
          "stock_location": {
            "resolve": "@zjedene-medusa/medusa/stock-location",
          },
          "store": {
            "resolve": "@zjedene-medusa/medusa/store",
          },
          "tax": {
            "resolve": "@zjedene-medusa/medusa/tax",
          },
          "translation": {
            "disable": true,
            "resolve": "@zjedene-medusa/medusa/translation",
          },
          "user": {
            "options": {
              "jwt_options": undefined,
              "jwt_public_key": undefined,
              "jwt_secret": "supersecret",
              "jwt_verify_options": undefined,
            },
            "resolve": "@zjedene-medusa/medusa/user",
          },
          "workflows": {
            "resolve": "@zjedene-medusa/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [
          {
            "options": {},
            "resolve": "@zjedene-medusa/draft-order",
          },
        ],
        "projectConfig": {
          "cloud": {
            "apiKey": "overriden-api-key",
            "emailsEndpoint": "overriden-emails-endpoint",
            "environmentHandle": "overriden-environment",
            "oauthAuthorizeEndpoint": "overriden-oauth-authorize-endpoint",
            "oauthCallbackUrl": undefined,
            "oauthDisabled": true,
            "oauthTokenEndpoint": "overriden-oauth-token-endpoint",
            "paymentsEndpoint": "overriden-payments-endpoint",
            "sandboxHandle": undefined,
            "webhookSecret": "overriden-webhook-secret",
          },
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtPublicKey": undefined,
            "jwtSecret": "supersecret",
            "restrictedFields": {
              "store": [
                ${DEFAULT_STORE_RESTRICTED_FIELDS.map((v) => `"${v}"`).join(
                  ",\n                "
                )},
              ],
            },
            "storeCors": "http://localhost:8000",
          },
          "redisOptions": {
            "retryStrategy": [Function],
          },
          "sessionOptions": {},
        },
      }
    `)
  })

  describe("secret defaults", function () {
    const originalNodeEnv = process.env.NODE_ENV
    const originalJwtSecret = process.env.JWT_SECRET
    const originalCookieSecret = process.env.COOKIE_SECRET

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv
      if (originalJwtSecret === undefined) {
        delete process.env.JWT_SECRET
      } else {
        process.env.JWT_SECRET = originalJwtSecret
      }
      if (originalCookieSecret === undefined) {
        delete process.env.COOKIE_SECRET
      } else {
        process.env.COOKIE_SECRET = originalCookieSecret
      }
    })

    it("should apply the default secret in non-production environments when no env vars are set", function () {
      process.env.NODE_ENV = "development"
      delete process.env.JWT_SECRET
      delete process.env.COOKIE_SECRET

      const config = defineConfig()

      expect(config.projectConfig.http.jwtSecret).toBe("supersecret")
      expect(config.projectConfig.http.cookieSecret).toBe("supersecret")
      expect((config.modules!["user"] as any).options.jwt_secret).toBe(
        "supersecret"
      )
    })

    it("should not apply the default secret when NODE_ENV is production", function () {
      process.env.NODE_ENV = "production"
      delete process.env.JWT_SECRET
      delete process.env.COOKIE_SECRET

      const config = defineConfig()

      expect(config.projectConfig.http.jwtSecret).toBeUndefined()
      expect(config.projectConfig.http.cookieSecret).toBeUndefined()
      expect(
        (config.modules!["user"] as any).options.jwt_secret
      ).toBeUndefined()
    })

    it("should not apply the default secret when NODE_ENV is prod", function () {
      process.env.NODE_ENV = "prod"
      delete process.env.JWT_SECRET
      delete process.env.COOKIE_SECRET

      const config = defineConfig()

      expect(config.projectConfig.http.jwtSecret).toBeUndefined()
      expect(config.projectConfig.http.cookieSecret).toBeUndefined()
      expect(
        (config.modules!["user"] as any).options.jwt_secret
      ).toBeUndefined()
    })

    it("should use the configured env var secrets in production", function () {
      process.env.NODE_ENV = "production"
      process.env.JWT_SECRET = "prod-jwt-secret"
      process.env.COOKIE_SECRET = "prod-cookie-secret"

      const config = defineConfig()

      expect(config.projectConfig.http.jwtSecret).toBe("prod-jwt-secret")
      expect(config.projectConfig.http.cookieSecret).toBe("prod-cookie-secret")
      expect((config.modules!["user"] as any).options.jwt_secret).toBe(
        "prod-jwt-secret"
      )
    })

    it("should prefer user-provided jwtSecret in production over the missing env var", function () {
      process.env.NODE_ENV = "production"
      delete process.env.JWT_SECRET
      delete process.env.COOKIE_SECRET

      const config = defineConfig({
        projectConfig: {
          http: {
            jwtSecret: "configured-jwt-secret",
            cookieSecret: "configured-cookie-secret",
          },
        } as any,
      })

      expect(config.projectConfig.http.jwtSecret).toBe("configured-jwt-secret")
      expect(config.projectConfig.http.cookieSecret).toBe(
        "configured-cookie-secret"
      )
      expect((config.modules!["user"] as any).options.jwt_secret).toBe(
        "configured-jwt-secret"
      )
    })
  })
})
