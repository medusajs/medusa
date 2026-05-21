import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createGiftCardsWorkflow } from "../../../workflows/gift-cards/workflows/create-gift-cards";
import { AdminCreateGiftCardParams, AdminGetGiftCardsParams, AdminGiftCardResponse, AdminGiftCardsResponse } from "../../../types";

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetGiftCardsParams>,
  res: MedusaResponse<AdminGiftCardsResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { fields, pagination } = req.queryConfig;
  const { data: gift_cards, metadata } = await query.graph({
    entity: "gift_cards",
    fields,
    filters: {
      ...req.filterableFields,
    },
    pagination: {
      ...pagination,
      skip: pagination.skip!,
    },
  });

  res.json({
    gift_cards,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateGiftCardParams>,
  res: MedusaResponse<AdminGiftCardResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    result: [giftCard],
  } = await createGiftCardsWorkflow.run({
    input: [{ ...req.validatedBody }],
    container: req.scope,
  });

  const {
    data: [gift_card],
  } = await query.graph(
    {
      entity: "gift_cards",
      fields: req.queryConfig.fields,
      filters: { id: giftCard.id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ gift_card });
};
