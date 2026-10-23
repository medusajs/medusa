import { ILockingProvider } from "@medusajs/framework/types"
import { ModuleProvider, Modules } from "@medusajs/framework/utils"

export class ShutdownLockingProviderFixture implements ILockingProvider {
  static identifier = "shutdown-fixture"

  async execute<T>(_keys: string | string[], job: () => Promise<T>) {
    return await job()
  }

  async acquire(): Promise<void> {}

  async release(): Promise<boolean> {
    return true
  }

  async releaseAll(): Promise<void> {}

  async shutdown(): Promise<void> {}
}

export default ModuleProvider(Modules.LOCKING, {
  services: [ShutdownLockingProviderFixture],
})
