import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import BatchJobService from "../batch-job"
import { EventBusService } from "../index"
import { BatchJobStatus } from "../../types/batch-job"
import { BatchJob } from "../../models"

const eventBusServiceMock = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
} as unknown as EventBusService
const batchJobRepositoryMock = MockRepository({
  create: jest.fn().mockImplementation((data) => {
    return Object.assign(new BatchJob(), data)
  })
})

describe('BatchJobService', () => {
  const batchJobId_1 = IdMap.getId("batchJob_1")
  const batchJobService = new BatchJobService({
    manager: MockManager,
    eventBusService: eventBusServiceMock,
    batchJobRepository: batchJobRepositoryMock
  } as any)

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('update status', () => {
    describe("confirm", () => {
      it('should be able to confirm_processing a batch job to emit the processing event', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.PRE_PROCESSED
        })

        const updatedBatchJob = await batchJobService.confirm(batchJob)
        expect(updatedBatchJob.processing_at).not.toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.CONFIRMED, { id: batchJobId_1 })
      })

      it('should not be able to confirm a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.CREATED
        })

        const err = await batchJobService.confirm(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot confirm processing for a batch job that is not pre processed")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("complete", () => {
      it('should be able to complete a batch job', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.PROCESSING
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
          status: BatchJobStatus.CREATED
        })

        const err = await batchJobService.complete(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe( `Cannot complete a batch job with status "${batchJob.status}". The batch job must be processing`)
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)

        const batchJob2 = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: false,
          status: BatchJobStatus.PRE_PROCESSED
        })

        const err2 = await batchJobService.complete(batchJob2)
          .catch(e => e)
        expect(err2).toBeTruthy()
        expect(err2.message).toBe( `Cannot complete a batch job with status "${batchJob2.status}". The batch job must be processing`)
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })

    describe("pre processed", () => {
      it('should be able to mark as pre processed a batch job in dry_run', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: true,
          status: BatchJobStatus.CREATED
        })

        const updatedBatchJob = await batchJobService.setPreProcessingDone(batchJob)
        expect(updatedBatchJob.pre_processed_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.PRE_PROCESSED, { id: batchJobId_1 })
      })

      it('should be able to mark as completed a batch job that has been pre processed but not in dry_run', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          dry_run: false,
          status: BatchJobStatus.CREATED
        })

        const updatedBatchJob = await batchJobService.setPreProcessingDone(batchJob)
        expect(updatedBatchJob.pre_processed_at).toBeTruthy()
        expect(updatedBatchJob.confirmed_at).toBeTruthy()
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(2)
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.PRE_PROCESSED, { id: batchJobId_1 })
        expect(eventBusServiceMock.emit)
          .toHaveBeenLastCalledWith(BatchJobService.Events.CONFIRMED, { id: batchJobId_1 })
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
          status: BatchJobStatus.CONFIRMED
        })

        const updatedBatchJob = await batchJobService.setProcessing(batchJob)
        expect(updatedBatchJob.processing_at).toBeTruthy()
        expect(eventBusServiceMock.emit)
          .toHaveBeenCalledWith(BatchJobService.Events.PROCESSING, { id: batchJobId_1 })
      })

      it('should not be able to mark as processing a batch job with the wrong status', async () => {
        const batchJob = batchJobRepositoryMock.create({
          id: batchJobId_1,
          status: BatchJobStatus.COMPLETED
        })

        const err = await batchJobService.setProcessing(batchJob)
          .catch(e => e)
        expect(err).toBeTruthy()
        expect(err.message).toBe("Cannot mark a batch job as processing if the status is different that confirmed")
        expect(eventBusServiceMock.emit).toHaveBeenCalledTimes(0)
      })
    })
  })
})