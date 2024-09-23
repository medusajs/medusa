import { IDistributedSchedulerStorage, SchedulerOptions } from "../../src"

export class MockSchedulerStorage implements IDistributedSchedulerStorage {
  async schedule(
    jobDefinition: string | { jobId: string },
    schedulerOptions: SchedulerOptions
  ): Promise<void> {
    return await Promise.resolve()
  }

  async remove(jobId: string): Promise<void> {
    return await Promise.resolve()
  }

  async removeAll(): Promise<void> {
    return await Promise.resolve()
  }
}
