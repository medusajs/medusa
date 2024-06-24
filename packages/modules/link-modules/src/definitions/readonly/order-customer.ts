import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

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
        args: {
          methodSuffix: "Customers",
        },
      },
    },
    {
      serviceName: Modules.CUSTOMER,
      relationship: {
        serviceName: Modules.ORDER,
        primaryKey: "customer_id",
        foreignKey: "id",
        alias: "orders",
        args: {
          methodSuffix: "Orders",
        },
        isList: true,
      },
    },
  ],
}
