import { DataSource } from "typeorm"
import { BatchJob, BatchJobStatus } from "@medusajs/medusa"

export type BatchJobFactoryData = {
  id?: string
  type?: string
  status?: BatchJobStatus
  created_by?: string
  context?: Record<string, unknown>
  awaiting_confirmation_at?: Date | string
  completed_at?: Date | string
}

export const simpleBatchJobFactory = async (
  dataSource: DataSource,
  data: BatchJobFactoryData = {}
): Promise<BatchJob> => {
  const manager = dataSource.manager

  const job = manager.create<BatchJob>(BatchJob, {
    id: data.id,
    status: data.status ?? BatchJobStatus.CREATED,
    completed_at: data.completed_at ?? null,
    type: data.type ?? "test-job",
    created_by: data.created_by ?? null,
    context: data.context ?? {},
  })

  return await manager.save<BatchJob>(job)
}
