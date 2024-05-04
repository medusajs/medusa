import { Queue } from "bullmq"
import JobSchedulerService from "../job-scheduler"

jest.genMockFromModule("bullmq")
jest.mock("bullmq")
jest.mock("ioredis")

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("JobSchedulerService", () => {
  let scheduler

  describe("constructor", () => {
    beforeAll(() => {
      jest.clearAllMocks()

      scheduler = new JobSchedulerService(
        {
          logger: loggerMock,
        },
        {
          projectConfig: {
            redis_url: "testhost",
          },
        }
      )
    })

    it("creates bull queue", () => {
      expect(Queue).toHaveBeenCalledTimes(1)
      expect(Queue).toHaveBeenCalledWith("scheduled-jobs:queue", {
        connection: expect.any(Object),
        prefix: "JobSchedulerService",
      })
    })
  })

  describe("create", () => {
    let jobScheduler

    beforeAll(async () => {
      jest.resetAllMocks()

      jobScheduler = new JobSchedulerService(
        {
          logger: loggerMock,
        },
        {
          projectConfig: {
            redis_url: "testhost",
          },
        }
      )

      await jobScheduler.create(
        "eventName",
        { data: "test" },
        "* * * * *",
        () => "test"
      )
    })

    it("added the handler to the job queue", () => {
      expect(jobScheduler.handlers_.get("eventName").length).toEqual(1)
      expect(jobScheduler.queue_.add).toHaveBeenCalledWith(
        "eventName",
        {
          eventName: "eventName",
          data: { data: "test" },
        },
        {
          repeat: { pattern: "* * * * *" },
        }
      )
    })
  })

  describe("scheduledJobWorker", () => {
    let jobScheduler
    let result

    beforeAll(async () => {
      jest.resetAllMocks()

      jobScheduler = new JobSchedulerService(
        {
          logger: loggerMock,
        },
        {
          projectConfig: {
            redis_url: "testhost",
          },
        }
      )

      await jobScheduler.create(
        "eventName",
        { data: "test" },
        "* * * * *",
        () => Promise.resolve("hi")
      )

      result = await jobScheduler.scheduledJobsWorker({
        data: { eventName: "eventName", data: {} },
      })
    })

    it("calls logger", () => {
      expect(loggerMock.info).toHaveBeenCalled()
      expect(loggerMock.info).toHaveBeenCalledWith(
        "Processing scheduled job: eventName"
      )
    })

    it("returns array with hi", async () => {
      expect(result).toEqual(["hi"])
    })
  })
})
