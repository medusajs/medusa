import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const OrderCustomer: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.ORDER,
      relationship: {
        serviceName: Modules.CUSTOMER,
        entity: "Customer",
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
        entity: "Order",
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
