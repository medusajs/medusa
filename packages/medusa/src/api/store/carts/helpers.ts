import { MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  deduplicate,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaStoreRequest,
} from "@medusajs/framework/http"
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "../../utils/middlewares/products"

export const refetchCart = async (
  id: string,
  scope: MedusaContainer,
  fields: string[],
  req?: MedusaStoreRequest<any, any> | AuthenticatedMedusaRequest<any, any>
) => {
  const withInventoryQuantity = fields.some((field) =>
    field.includes("items.variant.inventory_quantity")
  )

  const fieldsToFetch = withInventoryQuantity
    ? deduplicate([
        ...fields.filter(
          (field) => !field.includes("items.variant.inventory_quantity")
        ),
        "items.variant",
      ])
    : fields

  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "cart",
    variables: { filters: { id } },
    fields: fieldsToFetch,
  })

  const [cart] = await remoteQuery(queryObject)

  if (!cart) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Cart with id '${id}' not found`
    )
  }

  if (withInventoryQuantity && cart.items?.length && req) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req as MedusaStoreRequest,
      cart.items.map((item) => item.variant)
    )
  }

  return cart
}
