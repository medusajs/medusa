import { IModuleService } from "../modules-sdk"
import { Context } from "../shared-context"
import {
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
} from "./mutations"
import {
  FilterablePaymentCollectionProps,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentSessionDTO,
} from "./common"
import { FindConfig } from "../common"

export interface IPaymentModuleService extends IModuleService {
  /* ********** PAYMENT COLLECTION ********** */

  createPaymentCollections(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  createPaymentCollections(
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
  ): Promise<PaymentCollectionDTO[]>

  listAndCountPaymentCollections(
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
    sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]>

  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  deletePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<void>
  deletePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  completePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  completePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  /* ********** PAYMENT SESSION ********** */

  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>

  updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>

  deletePaymentSession(id: string, sharedContext?: Context): Promise<void>

  authorizePaymentSession(
    id: string,
    context: Record<string, unknown>,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  /* ********** PAYMENT ********** */

  createPayment(
    data: CreatePaymentDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  capturePayment(
    data: CreateCaptureDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  refundPayment(
    data: CreateRefundDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>

  cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>
}
