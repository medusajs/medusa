import {
  DAL,
  CreatePaymentCollectionDTO,
  UpdatePaymentCollectionDTO,
} from "@medusajs/types"

import { PaymentCollection } from "@models"

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
