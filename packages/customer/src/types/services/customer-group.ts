import { AbstractService } from "@medusajs/utils"
import { DAL } from "@medusajs/types"
import { CustomerGroup } from "@models"

export interface ICustomerGroupService<
  TEntity extends CustomerGroup = CustomerGroup
> extends AbstractService<
    TEntity,
    {
      customerGroupRepository: DAL.RepositoryService<TEntity>
    }
    // TODO Add DTOs and filters if necessary
  > {}
