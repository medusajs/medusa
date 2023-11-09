import { MedusaContainer } from "@medusajs/types"
import { join } from "path"
import { containerMock, jobSchedulerServiceMock } from "../__mocks__"
import ScheduledJobsRegistrar from "../index"

describe("ScheduledJobsRegistrar", () => {
  it("should register every job in '/jobs'", async () => {
    const rootDir = join(__dirname, "../__fixtures__", "jobs")
    const pluginOptions = {
      job_scheduler: {
        enabled: true,
      },
    }

    await new ScheduledJobsRegistrar(
      rootDir,
      containerMock as unknown as MedusaContainer,
      pluginOptions
    ).load()

    expect(jobSchedulerServiceMock.create).toHaveBeenCalledTimes(2)
  })
})
