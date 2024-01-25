import { AbstractService } from "@medusajs/utils"
import { PaymentCollection } from "@models"
import { IPaymentCollectionRepository } from "../repositories"
import {
  CreatePaymentCollectionDTO,
  UpdatePaymentCollectionDTO,
} from "@medusajs/types"

export interface IPaymentCollectionService<
  TEntity extends PaymentCollection = PaymentCollection
> extends AbstractService<
    TEntity,
    {
      paymentCollectionRepository: IPaymentCollectionRepository<TEntity>
    },
    // TODO revisit DTO if necessary
    {
      create: CreatePaymentCollectionDTO
      update: UpdatePaymentCollectionDTO
    }
  > {}
