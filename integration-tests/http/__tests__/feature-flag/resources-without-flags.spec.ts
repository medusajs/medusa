import { MedusaWorkflow } from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import { setTimeout as setTimeoutPromise } from "timers/promises"
import { testJobHandler } from "../../__fixtures__/feature-flag/src/jobs/test-job"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  cwd: path.join(__dirname, "../../__fixtures__/feature-flag"),
  testSuite: ({ api, dbConnection }) => {
    describe("Resources loaded without feature flags", () => {
      it("should not load migration when feature flag is disabled and not run job", async () => {
        const migrationNotExecuted = await dbConnection.raw(
          `SELECT name FROM "mikro_orm_migrations" WHERE name = 'MigrationTest'`
        )
        expect(migrationNotExecuted.rows).toHaveLength(0)

        const migrationExecuted = await dbConnection.raw(
          `SELECT name FROM "mikro_orm_migrations" WHERE name = 'Noop'`
        )

        expect(migrationExecuted.rows).toHaveLength(1)
        expect(migrationExecuted.rows[0].name).toBe("Noop")

        await setTimeoutPromise(1000)

        expect(testJobHandler).toHaveBeenCalledTimes(0)
      })

      it("should not load workflow when feature flag is disabled", async () => {
        expect(MedusaWorkflow.getWorkflow("test-workflow")).toBeUndefined()
      })

      it("should not load scheduled job when feature flag is disabled", async () => {
        expect(
          MedusaWorkflow.getWorkflow("job-greeting-every-second")
        ).toBeUndefined()
      })

      it("should not load endpoint when feature flag is disabled", async () => {
        expect(api.get("/custom")).rejects.toThrow()
      })

      it("should return 404 (not 400) for POST route with middleware when feature flag is disabled", async () => {
        const { response } = await api
          .post("/custom", {
            invalid: "test",
          })
          .catch((e) => e)

        expect(response.status).toBe(404)
      })
    })
  },
})
