import { model } from "@medusajs/framework/utils";
import { TransactionType } from "../../../types";
import storeCreditAccount from "./store-credit-account";

export default model.define(
  { tableName: "store_credit_account_transaction", name: "AccountTransaction" },
  {
    id: model.id({ prefix: "sc_trx" }).primaryKey(),

    amount: model.bigNumber(),
    type: model.enum(TransactionType),
    reference: model.text(),
    reference_id: model.text(),
    note: model.text().nullable(),

    account: model.belongsTo(() => storeCreditAccount, {
      mappedBy: "transactions",
    }),

    metadata: model.json().nullable(),
  }
);
