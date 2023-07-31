import { MedusaContainer } from "@medusajs/types"
import { EntityManager } from "typeorm"
import { StorePostCartsCartShippingMethodReq } from "../../../api"
import { Cart } from "../../../models"

export type InjectedDependencies = {
  manager: EntityManager
  container: MedusaContainer
}

export type AddShippingMethodWorkflowInputData = {
  cart: Cart
} & StorePostCartsCartShippingMethodReq
