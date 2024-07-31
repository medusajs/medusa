import {
  IDistributedSchedulerStorage,
  SchedulerOptions,
} from "@medusajs/orchestration"

export class MockSchedulerStorage implements IDistributedSchedulerStorage {
  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    return Promise.resolve()
  }

  async remove(jobId: string): Promise<void> {
    return Promise.resolve()
  }

  async removeAll(): Promise<void> {
    return Promise.resolve()
  }
}
