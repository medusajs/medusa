import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

export const CartCustomer: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
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
        serviceName: Modules.CART,
        primaryKey: "customer_id",
        foreignKey: "id",
        alias: "carts",
        args: {
          methodSuffix: "Carts",
        },
        isList: true,
      },
    },
  ],
}
