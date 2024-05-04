import { Logger, UpdateSalesChannelDTO } from "@medusajs/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type UpdateSalesChanneInput = UpdateSalesChannelDTO & { id: string }