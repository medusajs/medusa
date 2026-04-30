import { model } from "@medusajs/framework/utils";
import { GiftCardStatus } from "../../../types";

export default model.define(
  { tableName: "loyalty_gift_card", name: "GiftCard" },
  {
    id: model.id({ prefix: "gcard" }).primaryKey(),
    status: model.enum(GiftCardStatus).default(GiftCardStatus.PENDING),
    value: model.bigNumber(),
    code: model.text().searchable().unique(),
    currency_code: model.text().searchable(),
    expires_at: model.dateTime().nullable(),
    reference_id: model.text().nullable(),
    reference: model.text().nullable(),
    line_item_id: model.text().nullable(),
    note: model.text().nullable(),
    metadata: model.json().nullable(),
  }
);
