import { MedusaContainer } from "@medusajs/types"

class JobsRegistrar {
  protected container_: MedusaContainer
  protected pluginOptions_: Record<string, unknown>
  protected rootDir_: string

  constructor(
    rootDir: string,
    container: MedusaContainer,
    options: Record<string, unknown> = {}
  ) {
    this.rootDir_ = rootDir
    this.pluginOptions_ = options
    this.container_ = container
  }

  private async validateJob() {
    return null
  }

  //   private async createJob({}: {
  //     handler: ScheduledJobHandler
  //   }) {}

  //   async register() {
  //     const jobScheduler: JobSchedulerService = this.container_.resolve(
  //       "jobSchedulerService"
  //     )

  //     jobScheduler.create
  //   }
}
