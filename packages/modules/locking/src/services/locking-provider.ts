import { Constructor, DAL, ILockingProvider } from "@medusajs/framework/types"
import { MedusaError, ModulesSdkUtils } from "@medusajs/framework/utils"
import { LockingProvider } from "@models"
import { LockingProviderRegistrationPrefix } from "../types"

type InjectedDependencies = {
  lockingProviderRepository: DAL.RepositoryService
  [key: `lp_${string}`]: ILockingProvider
}

export default class LockingProviderService extends ModulesSdkUtils.MedusaInternalService<InjectedDependencies>(
  LockingProvider
) {
  protected readonly lockingProviderRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    super(container)
    this.lockingProviderRepository_ = container.lockingProviderRepository
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<ILockingProvider>,
    optionName?: string
  ) {
    if (!(providerClass as any).identifier) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Trying to register a locking provider without an identifier.`
      )
    }
    return `${(providerClass as any).identifier}_${optionName}`
  }

  protected retrieveProviderRegistration(providerId: string): ILockingProvider {
    try {
      return this.__container__[
        `${LockingProviderRegistrationPrefix}${providerId}`
      ]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a locking provider with id: ${providerId}`
      )
    }
  }
}
