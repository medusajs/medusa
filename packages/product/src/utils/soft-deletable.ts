// TODO: Should we create a mikro orm specific package for this and the base repository?

import { Filter } from "@mikro-orm/core"
import { DAL } from "@medusajs/types"

interface FilterArguments {
  withDeleted?: boolean
}

export const SoftDeletable = (): ClassDecorator => {
  return Filter({
    name: DAL.SoftDeletableFilterKey,
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
