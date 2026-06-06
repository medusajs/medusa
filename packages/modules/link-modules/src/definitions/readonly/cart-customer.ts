import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"

export const CartCustomer: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: Modules.CART,
      entity: "Cart",
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
      entity: "Customer",
      relationship: {
        serviceName: Modules.CART,
        entity: "Cart",
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
