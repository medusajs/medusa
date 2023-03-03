import Bull from "bull"
import config from "../../loaders/config"
import JobSchedulerService from "../job-scheduler"

jest.genMockFromModule("bull")
jest.mock("bull")
jest.mock("../../loaders/config")

config.redisURI = "testhost"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("JobSchedulerService", () => {
  describe("constructor", () => {
    let jobScheduler
    beforeAll(() => {
      jest.resetAllMocks()

      jobScheduler = new JobSchedulerService({
        logger: loggerMock,
      })
    })

    it("creates bull queue", () => {
      expect(Bull).toHaveBeenCalledTimes(1)
      expect(Bull).toHaveBeenCalledWith("scheduled-jobs:queue", {
        createClient: expect.any(Function),
      })
    })
  })

  describe("create", () => {
    let jobScheduler
    describe("successfully creates scheduled job and add handler", () => {
      beforeAll(() => {
        jest.resetAllMocks()

        jobScheduler = new JobSchedulerService({
          logger: loggerMock,
        })

        jobScheduler.create(
          "eventName",
          { data: "test" },
          "* * * * *",
          () => "test"
        )
      })

      it("added the handler to the job queue", () => {
        expect(jobScheduler.handlers_.get("eventName").length).toEqual(1)
        expect(jobScheduler.queue_.add).toHaveBeenCalledWith(
          {
            eventName: "eventName",
            data: { data: "test" },
          },
          {
            repeat: { cron: "* * * * *" },
          }
        )
      })
    })

    describe("scheduledJobWorker", () => {
      let jobScheduler
      let result
      describe("successfully runs the worker", () => {
        beforeAll(async () => {
          jest.resetAllMocks()

          jobScheduler = new JobSchedulerService(
            {
              logger: loggerMock,
            },
            {}
          )

          jobScheduler.create("eventName", { data: "test" }, "* * * * *", () =>
            Promise.resolve("hi")
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
  })
})
