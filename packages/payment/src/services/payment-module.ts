import {
  DAL,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { Payment } from "@models"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
}

// TODO: implement IPaymentModule
export default class PaymentModule<TPayment extends Payment = Payment> {
  protected baseRepository_: DAL.RepositoryService

  constructor(
    { baseRepository }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }
}
