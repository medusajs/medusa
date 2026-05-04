import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { AdminOrder } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils";

import { generateCode } from "../utils/code-generator";
import { createGiftCardsWorkflow } from "../workflows/gift-cards/workflows/create-gift-cards";

export default async function createGiftCardHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderId = data.id;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    filters: { id: orderId },
    fields: [
      "id",
      "currency_code",
      "items.id",
      "items.subtotal",
      "items.quantity",
      "items.*",
      "items.product.is_giftcard",
      "total",
      "subtotal",
      "tax_total",
    ],
  });

  const giftCardLineItems = (order as AdminOrder).items.filter(
    (item) => !!item.product?.is_giftcard
  );

  if (giftCardLineItems.length === 0) {
    return;
  }

  for (const giftCardLineItem of giftCardLineItems) {
    // For each gift card line item quantity, create a gift card using for const giftCard of giftCardLineItem.quantity
    for (let i = 0; i < giftCardLineItem.quantity; i++) {
      const giftCardValue =
        giftCardLineItem.subtotal / giftCardLineItem.quantity;

      const {
        result: [giftCard],
      } = await createGiftCardsWorkflow.run({
        input: [
          {
            value: giftCardValue,
            currency_code: order.currency_code,
            line_item_id: giftCardLineItem.id,
            reference: "order",
            reference_id: order.id,
            metadata: {},
          },
        ],
        container,
      });
    }
  }
}

export const config: SubscriberConfig = {
  event: OrderWorkflowEvents.PLACED,
};
