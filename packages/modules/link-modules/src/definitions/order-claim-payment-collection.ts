import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

export const OrderClaimPaymentCollection: ModuleJoinerConfig = {
  serviceName: LINKS.OrderClaimPaymentCollection,
  isLink: true,
  databaseConfig: {
    tableName: "order_claim_payment_collection",
    idPrefix: "claimpay",
  },
  alias: [
    {
      name: [
        "order_claim_payment_collection",
        "order_claim_payment_collections",
      ],
      entity: "LinkOrderClaimPaymentCollection",
    },
  ],
  primaryKeys: ["id", "claim_id", "payment_collection_id"],
  relationships: [
    {
      serviceName: Modules.ORDER,
      entity: "OrderClaim",
      primaryKey: "id",
      foreignKey: "claim_id",
      alias: "order",
      args: {
        methodSuffix: "OrderClaims",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      entity: "PaymentCollection",
      primaryKey: "id",
      foreignKey: "payment_collection_id",
      alias: "payment_collection",
      args: {
        methodSuffix: "PaymentCollections",
      },
      hasMany: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.ORDER,
      entity: "OrderClaim",
      fieldAlias: {
        claim_payment_collections: {
          path: "claim_payment_collections_link.payment_collection",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.OrderClaimPaymentCollection,
        primaryKey: "claim_id",
        foreignKey: "id",
        alias: "claim_payment_collections_link",
      },
    },
    {
      serviceName: Modules.PAYMENT,
      entity: "PaymentCollection",
      fieldAlias: {
        claim: "order_claim_link.order",
      },
      relationship: {
        serviceName: LINKS.OrderClaimPaymentCollection,
        primaryKey: "payment_collection_id",
        foreignKey: "id",
        alias: "order_claim_link",
      },
    },
  ],
}
