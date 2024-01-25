import { AbstractService } from "@medusajs/utils"
import { DAL } from "@medusajs/types"
import {Customer} from "@models";

export interface ICustomerService<TEntity extends Customer = Customer>
  extends AbstractService<
    TEntity,
    {
      customerRepository: DAL.RepositoryService<TEntity>
    }
    // TODO Add DTOs and filters if necessary
  > {}
