// TODO: Should we create a mikro orm specific package for this and the base repository?

import { Filter } from "@mikro-orm/core"
import { SoftDeletableFilterKey } from "@medusajs/utils"

interface FilterArguments {
  withDeleted?: boolean
}

export const SoftDeletable = (): ClassDecorator => {
  return Filter({
    name: SoftDeletableFilterKey,
    cond: ({ withDeleted }: FilterArguments = {}) => {
      if (withDeleted) {
        return {}
      }
      return {
        deleted_at: null,
      }
    },
    default: true,
  })
}
