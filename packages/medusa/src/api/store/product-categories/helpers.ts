import { MedusaContainer } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchCategory = async (
  categoryId: string,
  scope: MedusaContainer,
  fields: string[],
  filterableFields: Record<string, any> = {}
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_category",
    variables: {
      filters: { ...filterableFields, id: categoryId },
    },
    fields: fields,
  })

  const categories = await remoteQuery(queryObject)
  return categories[0]
}

export const applyCategoryFilters = (req, res, next) => {
  if (!req.filterableFields) {
    req.filterableFields = {}
  }

  req.filterableFields = {
    ...req.filterableFields,
    is_active: true,
    is_internal: false,
  }

  next()
}
