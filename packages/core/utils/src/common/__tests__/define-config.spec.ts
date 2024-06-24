import { Modules } from "../../modules-sdk"
import { defineConfig } from "../define-config"

describe("defineConfig", function () {
  it("should merge empty config with the defaults", function () {
    expect(defineConfig()).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
        },
        "featureFlags": {},
        "modules": {
          "apiKey": true,
          "auth": true,
          "cacheService": true,
          "cart": true,
          "currency": true,
          "customer": true,
          "eventBus": true,
          "file": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "manual": {},
                    },
                  },
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/fulfillment",
          },
          "inventoryService": true,
          "notification": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/notification",
          },
          "order": true,
          "payment": true,
          "pricingService": true,
          "productService": true,
          "promotion": true,
          "region": true,
          "salesChannel": true,
          "stockLocationService": true,
          "store": true,
          "tax": true,
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "workflows": true,
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should merge custom modules", function () {
    expect(
      defineConfig({
        modules: {
          githubModuleService: {
            resolve: "./modules/github",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
        },
        "featureFlags": {},
        "modules": {
          "apiKey": true,
          "auth": true,
          "cacheService": true,
          "cart": true,
          "currency": true,
          "customer": true,
          "eventBus": true,
          "file": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "manual": {},
                    },
                  },
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/fulfillment",
          },
          "githubModuleService": {
            "resolve": "./modules/github",
          },
          "inventoryService": true,
          "notification": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/notification",
          },
          "order": true,
          "payment": true,
          "pricingService": true,
          "productService": true,
          "promotion": true,
          "region": true,
          "salesChannel": true,
          "stockLocationService": true,
          "store": true,
          "tax": true,
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "workflows": true,
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
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
          "backendUrl": "http://localhost:9000",
        },
        "featureFlags": {},
        "modules": {
          "apiKey": true,
          "auth": true,
          "cacheService": true,
          "cart": true,
          "currency": true,
          "customer": true,
          "eventBus": true,
          "file": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "manual": {},
                    },
                  },
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/fulfillment",
          },
          "inventoryService": true,
          "notification": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/notification",
          },
          "order": true,
          "payment": true,
          "pricingService": true,
          "productService": true,
          "promotion": true,
          "region": true,
          "salesChannel": true,
          "stockLocationService": true,
          "store": true,
          "tax": true,
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "workflows": true,
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should not include disabled modules", function () {
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
          "backendUrl": "http://localhost:9000",
        },
        "featureFlags": {},
        "modules": {
          "apiKey": true,
          "auth": true,
          "cacheService": true,
          "currency": true,
          "customer": true,
          "eventBus": true,
          "file": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
          },
          "fulfillment": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "manual": {},
                    },
                  },
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/fulfillment",
          },
          "inventoryService": true,
          "notification": {
            "options": {
              "providers": [
                {
                  "options": {
                    "config": {
                      "local": {},
                    },
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/notification",
          },
          "order": true,
          "payment": true,
          "pricingService": true,
          "productService": true,
          "promotion": true,
          "region": true,
          "salesChannel": true,
          "stockLocationService": true,
          "store": true,
          "tax": true,
          "user": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "workflows": true,
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })
})
