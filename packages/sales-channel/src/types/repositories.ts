import { DAL } from "@medusajs/types"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
import { SalesChannel } from "@models"
import { CreateSalesChannelDTO, UpdateSalesChannelDTO } from "@medusajs/types"

export interface ISalesChannelRepository<
  TEntity extends SalesChannel = SalesChannel
> extends DAL.RepositoryService<
    TEntity,
    {
      create: CreateSalesChannelDTO
      update: UpdateSalesChannelDTO
    }
  > {}
