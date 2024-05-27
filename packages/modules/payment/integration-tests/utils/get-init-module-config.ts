import { Modules, ModulesDefinition } from "@medusajs/modules-sdk"

import { DB_URL } from "./database"

export function getInitModuleConfig() {
  const moduleOptions = {
    providers: [
      {
        resolve: "@medusajs/payment-stripe",
        options: {
          config: {
            dkk: {
              apiKey: "pk_test_123",
            },
            usd: {
              apiKey: "pk_test_456",
            },
          },
        },
      },
    ],
  }

  const injectedDependencies = {}

  const modulesConfig_ = {
    [Modules.PAYMENT]: {
      definition: ModulesDefinition[Modules.PAYMENT],
      options: moduleOptions,
    },
  }

  return {
    injectedDependencies,
    modulesConfig: modulesConfig_,
    databaseConfig: {
      clientUrl: DB_URL,
      schema: process.env.MEDUSA_PAYMENT_DB_SCHEMA,
    },
    joinerConfig: [],
  }
}
