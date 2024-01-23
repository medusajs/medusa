import { Payment } from "@models"
import {
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentDTO,
  CreateRefundDTO,
  DAL,
  FindConfig,
  RefundDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectManager,
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
  protected paymentRepository_: DAL.RepositoryService

  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)

    this.paymentRepository_ = container.paymentRepository
    this.captureRepository_ = container.captureRepository
    this.refundRepository_ = container.refundRepository
  }

  protected transformQueryForAmounts(config: FindConfig<TEntity>) {
    const select = config?.select
    let relations = config?.relations
    const amountsSelect: string[] = []

    if (select?.includes("captured_amount")) {
      amountsSelect.push("captured_amount")
      if (!relations?.includes("captures")) {
        if (!relations) {
          relations = ["captures"]
        } else {
          relations?.push("captures")
        }
      }
    }

    if (select?.includes("refunded_amount")) {
      amountsSelect.push("refunded_amount")
      if (!relations?.includes("refunds")) {
        if (!relations) {
          relations = ["refunds"]
        } else {
          relations?.push("refunds")
        }
      }
    }

    return { select, relations, amountsSelect }
  }

  protected decorateAmounts(payment: TEntity, amountsSelected: string[]) {
    const amounts = {}

    for (const amountName of amountsSelected) {
      if (amountName === "captured_amount") {
        amounts["captured_amount"] = payment.captures.reduce(
          (sum, capture) => sum + Number(capture.amount), // TODO: revisit this
          0
        )
      }
      if (amountName === "refunded_amount") {
        amounts["refunded_amount"] = payment.refunds.reduce(
          (sum, refund) => sum + Number(refund.amount), // TODO: revisit this
          0
        )
      }
    }

    return Object.assign(payment, amounts) as TEntity
  }

  @InjectManager("paymentRepository_")
  async retrieve(
    id: string,
    config: FindConfig<TEntity> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<TEntity> {
    const { select, relations, amountsSelect } =
      this.transformQueryForAmounts(config)

    const result = await super.retrieve(
      id,
      { ...config, select, relations },
      sharedContext
    )

    return this.decorateAmounts(result, amountsSelect) as unknown as TEntity
  }

  @InjectTransactionManager("captureRepository_")
  async capture(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<CaptureDTO> {
    const created = await this.captureRepository_.create(
      [
        {
          payment: data.payment_id,
          ...data,
        },
      ],
      sharedContext
    )

    return created[0]
  }

  @InjectTransactionManager("refundRepository_")
  async refund(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<RefundDTO> {
    const created = await this.refundRepository_.create(
      [
        {
          payment: data.payment_id,
          ...data,
        },
      ],
      sharedContext
    )

    return created[0]
  }
}
