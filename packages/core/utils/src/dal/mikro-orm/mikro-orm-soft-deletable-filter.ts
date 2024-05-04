export const SoftDeletableFilterKey = "softDeletable"

interface FilterArguments {
  withDeleted?: boolean
}

export const mikroOrmSoftDeletableFilterOptions = {
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
  args: false,
}
