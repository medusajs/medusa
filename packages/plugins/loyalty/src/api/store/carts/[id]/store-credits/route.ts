import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework";
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils";
import { HttpTypes } from "@zjedene-medusa/framework/types";
import { addStoreCreditsToCartWorkflow } from "../../../../../workflows/carts/workflows/add-store-credits-to-cart";
import { StoreAddStoreCreditsToCart } from "../../../../../types";

export const POST = async (
  req: AuthenticatedMedusaRequest<StoreAddStoreCreditsToCart>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);
  const { id } = req.params;

  await addStoreCreditsToCartWorkflow.run({
    input: {
      cart_id: id,
      ...req.validatedBody,
    },
    container: req.scope,
  });

  const {
    data: [cart],
  } = await query.graph(
    {
      entity: "cart",
      fields: req.queryConfig.fields,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ cart });
};
