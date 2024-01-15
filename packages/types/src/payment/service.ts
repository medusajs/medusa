import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
} from "./mutations"
import {
  FilterablePaymentCollectionProps,
  PaymentCollectionDTO,
  PaymentDTO,
} from "./common"
import { FindConfig } from "../common"

export interface IPaymentModuleService extends IModuleService {
  createPaymentCollection(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  createPaymentCollection(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  retrievePaymentCollection(
    paymentCollectionId: string,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  listPaymentCollections(
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]>

  listAndCountPaymentCollections(
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]>

  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  deletePaymentCollection(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<void>
  deletePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  authorizePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  completePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  createPayment(data: CreatePaymentDTO): Promise<PaymentDTO>

  capturePayment(paymentId: string, amount: number): Promise<PaymentDTO>
  refundPayment(paymentId: string, amount: number): Promise<PaymentDTO>

  updatePayment(data: UpdatePaymentDTO): Promise<PaymentDTO>

  // TODO: PaymentSession methods
}
