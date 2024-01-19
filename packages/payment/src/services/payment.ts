import { Payment } from "@models"
import {
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentDTO,
  CreateRefundDTO,
  DAL,
  RefundDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

type InjectedDependencies = {
  paymentRepository: DAL.RepositoryService
  captureRepository: DAL.RepositoryService
  refundRepository: DAL.RepositoryService
}

export default class PaymentService<
  TEntity extends Payment = Payment
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreatePaymentDTO
    update: UpdatePaymentDTO
  }
>(Payment)<TEntity> {
  protected captureRepository_: DAL.RepositoryService
  protected refundRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)

    this.captureRepository_ = container.captureRepository
    this.refundRepository_ = container.refundRepository
  }

  @InjectTransactionManager("captureRepository_")
  async capture(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<CaptureDTO> {
    const created = await this.captureRepository_.create([data])

    return created[0]
  }

  @InjectTransactionManager("refundRepository_")
  async refund(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<RefundDTO> {
    const created = await this.refundRepository_.create([data])

    return created[0]
  }
}
