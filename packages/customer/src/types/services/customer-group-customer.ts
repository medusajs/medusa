import { AbstractService } from "@medusajs/utils"
import { DAL } from "@medusajs/types"
import { CustomerGroupCustomer } from "@models"

export interface ICustomerGroupCustomerService<
  TEntity extends CustomerGroupCustomer = CustomerGroupCustomer
> extends AbstractService<
    TEntity,
    {
      customerGroupCustomerRepository: DAL.RepositoryService<TEntity>
    },
    // TODO Add DTOs and filters if necessary
    {
      create: CreateCustomerGroupCustomerDTO
    }
  > {}

export interface CreateCustomerGroupCustomerDTO {
  customer_id: string
  customer_group_id: string
  created_by?: string
}
