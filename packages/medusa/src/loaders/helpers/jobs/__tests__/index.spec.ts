import { MedusaContainer } from "@medusajs/types"
import { join } from "path"
import { containerMock, jobSchedulerServiceMock } from "../__mocks__"
import ScheduledJobsRegistrar from "../index"

describe("ScheduledJobsRegistrar", () => {
  const rootDir = join(__dirname, "../__fixtures__", "jobs")

  const pluginOptions = {
    important_data: {
      enabled: true,
    },
  }

  beforeAll(async () => {
    jest.clearAllMocks()

    await new ScheduledJobsRegistrar(
      rootDir,
      containerMock as unknown as MedusaContainer,
      pluginOptions
    ).load()
  })

  it("should register every job in '/jobs'", async () => {
    // As '/jobs' contains 2 jobs, we expect the create method to be called twice
    expect(jobSchedulerServiceMock.create).toHaveBeenCalledTimes(2)
  })

  it("should register every job with the correct props", async () => {
    // Registering every-hour.ts
    expect(jobSchedulerServiceMock.create).toHaveBeenCalledWith(
      "every-hour",
      {},
      "0 * * * *",
      expect.any(Function),
      { keepExisting: false }
    )

    // Registering every-minute.ts
    expect(jobSchedulerServiceMock.create).toHaveBeenCalledWith(
      "every-minute",
      {},
      "* * * * *",
      expect.any(Function),
      { keepExisting: false }
    )
  })
})
