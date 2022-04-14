import { Connection } from "typeorm"
import { BatchJob, BatchJobStatus } from "@medusajs/medusa"

export type BatchJobFactoryData = {
  id?: string
  type?: string
  status?: BatchJobStatus
  created_by?: string
  context?: Record<string, unknown>
}

export const simpleBatchJobFactory = async (
  connection: Connection,
  data: BatchJobFactoryData = {}
): Promise<BatchJob> => {
  const manager = connection.manager

  const job = manager.create(BatchJob, {
    id: data.id,
    status: data.status ?? BatchJobStatus.CREATED,
    type: data.type ?? "test-job",
    created_by: data.created_by ?? null,
    context: data.context ?? {},
  })

  return await manager.save(job)
}
