import { EntityManager } from "typeorm"
import { MedusaContainer } from "@medusajs/types"
import { AdminPostProductsReq } from "../../../api"

export type InjectedDependencies = {
  manager: EntityManager
  container: MedusaContainer
}

export type CreateProductsWorkflowInputData = AdminPostProductsReq[]
