import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import BatchJobService from "../batch-job"
import { EventBusService } from "../index"
import { BatchJobStatus } from "../../types/batch-job"

const eventBusServiceMock = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
} as unknown as EventBusService
const batchJobRepositoryMock = MockRepository({
  create: jest.fn().mockImplementation((data) => {
    return data
  })
})

describe('BatchJobService', () => {
  const batchJobId_1 = IdMap.getId("batchJob_1")
  const batchJobService = new BatchJobService({
    manager: MockManager,
    eventBusService: eventBusServiceMock,
    batchJobRepository: batchJobRepositoryMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('update status', () => {
    describe("confirm", () => {
      it('should be able to confirm a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.AWAITING_CONFIRMATION
        })

        const updatedBatchJob = await batchJobService.confirm(batchJob)
        expect(updatedBatchJob.confirmed_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.CONFIRMED, { id: batchJobId_1 })
      })

      it('should not be able to confirm a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.READY
        })

        const err = await batchJobService.confirm(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot confirm a batch job that is not awaiting for confirmation")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("complete", () => {
      it('should be able to complete a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.CONFIRMED
        })

        const updatedBatchJob = await batchJobService.complete(batchJob)
        expect(updatedBatchJob.completed_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.COMPLETED, { id: batchJobId_1 })

        const batchJob2 = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: false,
          status: BatchJobStatus.PROCESSING
        })

        const updatedBatchJob2 = await batchJobService.complete(batchJob2)
        expect(updatedBatchJob2.completed_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.COMPLETED, { id: batchJobId_1 })
      })

      it('should not be able to complete a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.READY
        })

        const err = await batchJobService.complete(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe(`Cannot complete a batch job with status "${BatchJobStatus.READY}". The batch job must be in dry_run and awaiting for confirmation`)
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)

        const batchJob2 = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: false,
          status: BatchJobStatus.READY
        })

        const err2 = await batchJobService.complete(batchJob2)
          .catch(e => e)
        expect(err2).toBeTruthy()
        expect(err2.message).toBe(`Cannot complete a batch job with status "${BatchJobStatus.READY}". The batch job must be in dry_run and awaiting for confirmation`)
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("ready", () => {
      it('should be able to mark as ready a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.CREATED
        })

        const updatedBatchJob = await batchJobService.ready(batchJob)
        expect(updatedBatchJob.ready_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.READY, { id: batchJobId_1 })
      })

      it('should not be able to mark as ready a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.PROCESSING
        })

        const err = await batchJobService.ready(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot mark a batch job as ready if the status is different that created")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("cancel", () => {
      it('should be able to cancel a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.CREATED
        })

        const updatedBatchJob = await batchJobService.cancel(batchJob)
        expect(updatedBatchJob.canceled_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.CANCELED, { id: batchJobId_1 })
      })

      it('should not be able to cancel a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.COMPLETED
        })

        const err = await batchJobService.cancel(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot cancel completed batch job")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("processing", () => {
      it('should be able to mark as processing a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.READY
        })

        const updatedBatchJob = await batchJobService.processing(batchJob)
        expect(updatedBatchJob.processing_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.PROCESSING, { id: batchJobId_1 })
      })

      it('should not be able to mark as processing a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.COMPLETED
        })

        const err = await batchJobService.processing(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot mark a batch job as processing if the status is different that ready")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })
  })
})