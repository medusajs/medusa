import path from "path"
import { registerJobs } from "../helpers/register-jobs"
import { WorkflowManager, WorkflowScheduler } from "@medusajs/orchestration"
import { MockSchedulerStorage } from "../__fixtures__/mock-scheduler-storage"

describe("register jobs", () => {
  WorkflowScheduler.setStorage(new MockSchedulerStorage())
  it("registers jobs from plugins", async () => {
    await registerJobs([
      { resolve: path.join(__dirname, "../__fixtures__/plugin") },
    ])
    const workflow = WorkflowManager.getWorkflow("job-summarize-orders")
    expect(workflow).toBeDefined()
    expect(workflow?.options.schedule).toEqual({
      cron: "* * * * * *",
      numberOfExecutions: 2,
    })
  })
})
