import {
  DAL,
  CreatePaymentCollectionDTO,
  UpdatePaymentCollectionDTO,
  CreatePaymentDTO,
  UpdatePaymentDTO,
  CreatePaymentSessionDTO,
  CreateCaptureDTO,
  CreateRefundDTO,
} from "@medusajs/types"

import {
  Capture,
  Payment,
  PaymentCollection,
  PaymentSession,
  Refund,
} from "@models"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPaymentCollectionRepository<
  TEntity extends PaymentCollection = PaymentCollection
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePaymentCollectionDTO
      update: UpdatePaymentCollectionDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPaymentRepository<TEntity extends Payment = Payment>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePaymentDTO
      update: UpdatePaymentDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPaymentSessionRepository<
  TEntity extends PaymentSession = PaymentSession
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreatePaymentSessionDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICaptureRepository<TEntity extends Capture = Capture>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateCaptureDTO
    }
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRefundRepository<TEntity extends Refund = Refund>
  extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateRefundDTO
    }
  > {}
