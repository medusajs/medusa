import { MedusaApp } from "@medusajs/modules-sdk"
import {
  IWorkflowOrchestratorModuleService,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { knex } from "knex"
import "../__fixtures__/"
import { DB_URL, TestDatabase } from "../utils"

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase(sharedPgConnection)
}

const afterEach_ = async () => {}

describe("Workflow Orchestrator module", function () {
  describe("Testing basic workflow", function () {
    let workflowOrcModule: IWorkflowOrchestratorModuleService
    let query: (
      query: string | RemoteJoinerQuery | object,
      variables?: Record<string, unknown>
    ) => Promise<any>

    beforeEach(async () => {
      const {
        runMigrations,
        query: remoteQuery,
        modules,
      } = await MedusaApp({
        sharedResourcesConfig: {
          database: {
            connection: sharedPgConnection,
          },
        },
        modulesConfig: {
          workflowOrchestrator: {
            options: {
              database: {
                clientUrl: DB_URL,
                schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
                debug: true,
              },
            },
          },
        },
      })

      query = remoteQuery

      await runMigrations()

      workflowOrcModule =
        modules.workflowOrchestrator as unknown as IWorkflowOrchestratorModuleService
    })

    afterEach(afterEach_)

    it("should return a list of workflow executions", async () => {
      await workflowOrcModule.run("worflow_1", {
        input: {
          value: "123",
        },
        throwOnError: true,
      })

      const executions = await query({
        workflow_executions: {
          fields: ["workflow_id", "transaction_id", "state"],
        },
      })

      console.log(executions)
      expect(executions).toHaveLength(1)
    })
  })
})
