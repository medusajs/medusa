import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const OrderCustomer: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.CUSTOMER,
        primaryKey: "id",
        foreignKey: "customer_id",
        alias: "customer",
      },
    },
    {
      serviceName: Modules.CUSTOMER,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "customer_id",
        foreignKey: "id",
        alias: "orders",
        isList: true,
      },
    },
  ],
}
