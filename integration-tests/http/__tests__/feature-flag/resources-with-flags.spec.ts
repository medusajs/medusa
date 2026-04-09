import { MedusaWorkflow } from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import { testJobHandler } from "../../__fixtures__/feature-flag/src/jobs/test-job"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../../__fixtures__/feature-flag"),
  env: {
    CUSTOM_FF: true,
  },
  testSuite: ({ api, dbConnection }) => {
    describe("Resources loaded with feature flags", () => {
      it("should load migration when feature flag is enabled and run job", async () => {
        const migrationNotExecuted = await dbConnection.raw(
          `SELECT name FROM "mikro_orm_migrations" WHERE name = 'Noop'`
        )
        expect(migrationNotExecuted.rows).toHaveLength(0)

        const migrationExecuted = await dbConnection.raw(
          `SELECT name FROM "mikro_orm_migrations" WHERE name = 'MigrationTest'`
        )

        expect(migrationExecuted.rows).toHaveLength(1)
        expect(migrationExecuted.rows[0].name).toBe("MigrationTest")

        await setTimeoutPromise(1000)

        expect(testJobHandler).toHaveBeenCalledTimes(1)
      })

      it("should load workflow when feature flag is enabled", async () => {
        expect(MedusaWorkflow.getWorkflow("test-workflow")).toBeDefined()
      })

      it("should load scheduled job when feature flag is enabled", async () => {
        expect(
          MedusaWorkflow.getWorkflow("job-greeting-every-second")
        ).toBeDefined()
      })

      it("should load endpoint when feature flag is enabled", async () => {
        expect((await api.get("/custom")).status).toBe(200)
        expect(
          (
            await api.post("/custom", {
              foo: "test",
            })
          ).status
        ).toBe(200)
      })

      it("should return 400 for POST route with invalid body when feature flag is enabled", async () => {
        const response = await api
          .post("/custom", {
            invalid: 1,
          })
          .catch((e) => e)

        expect(response.status).toBe(400)
      })
    })
  },
})
