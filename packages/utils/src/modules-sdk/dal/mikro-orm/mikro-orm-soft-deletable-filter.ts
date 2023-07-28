import { SoftDeletableFilterKey } from "../../../common"

interface FilterArguments {
  withDeleted?: boolean
}

export const MikroOrmSoftDeletable = (): ClassDecorator => {
  const { Filter } = require("@mikro-orm/core")
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
