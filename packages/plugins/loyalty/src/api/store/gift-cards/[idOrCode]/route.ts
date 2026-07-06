import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils";
import { StoreGetGiftCardParams } from "../../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest<StoreGetGiftCardParams>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { idOrCode: code } = req.params;

  if (!code?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_ARGUMENT,
      "Code is required"
    );
  }

  const {
    data: [gift_card],
  } = await query.graph({
    entity: "gift_cards",
    fields: req.queryConfig.fields,
    filters: {
      code,
    },
  });

  if (!gift_card) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Gift card not found");
  }

  res.json({ gift_card });
};
