import { Constructor, ILockingProvider } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { LockingProviderRegistrationPrefix } from "../types"

type InjectedDependencies = {
  [key: `lp_${string}`]: ILockingProvider
}

export default class LockingProviderService {
  protected __container__: InjectedDependencies

  constructor(container: InjectedDependencies) {
    this.__container__ = container
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<ILockingProvider>
  ) {
    if (!(providerClass as any).identifier) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Trying to register a locking provider without an identifier.`
      )
    }
    return `${(providerClass as any).identifier}`
  }

  public retrieveProviderRegistration(providerId: string): ILockingProvider {
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
