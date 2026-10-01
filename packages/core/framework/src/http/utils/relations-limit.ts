import { MedusaError } from "@medusajs/utils"

export const getRelationsDepth = (field: string): number => {
  const isStarField = field.startsWith("*") || field.endsWith(".*")
  const segments = field.replace(/(^\*|\.\*$)/, "").split(".").length

  return isStarField ? segments : segments - 1
}

export const validateRelationsLimit = (
  fields: string[],
  limit: number
): void => {
  const invalidFields = fields.filter(
    (field) => getRelationsDepth(field) > limit
  )

  if (!invalidFields.length) {
    return
  }

  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    `The following fields expand more than the maximum of ${limit} allowed relations: ${invalidFields.join(
      ", "
    )}`
  )
}
