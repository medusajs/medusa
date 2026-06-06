import { Logger, UpdateSalesChannelDTO } from "@zjedene-medusa/framework/types"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type UpdateSalesChanneInput = UpdateSalesChannelDTO & { id: string }
