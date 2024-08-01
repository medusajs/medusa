import { join } from "path"
import { WorkflowManager, WorkflowScheduler } from "@medusajs/orchestration"
import { MockSchedulerStorage } from "../__fixtures__/mock-scheduler-storage"
import { JobLoader } from "../job-loader"

describe("register jobs", () => {
  WorkflowScheduler.setStorage(new MockSchedulerStorage())

  let jobLoader!: JobLoader

  beforeAll(() => {
    jobLoader = new JobLoader(join(__dirname, "../__fixtures__/plugin/jobs"))
  })

  it("registers jobs from plugins", async () => {
    await jobLoader.load()
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(workflow?.options.schedule).toEqual({
      cron: "* * * * * *",
      numberOfExecutions: 2,
    })
  })
})
