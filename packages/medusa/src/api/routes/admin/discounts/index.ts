import { Router } from "express"
import "reflect-metadata"
import { Discount } from "../../../.."
import { DiscountCondition } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  doesConditionBelongToDiscount,
  transformBody,
  transformQuery,
} from "../../../middlewares"
import {
  AdminPostDiscountsDiscountConditionsConditionBatchParams,
  AdminPostDiscountsDiscountConditionsConditionBatchReq,
} from "./add-resources-to-condition-batch"
import {
  AdminPostDiscountsDiscountConditionsCondition,
  AdminPostDiscountsDiscountConditionsConditionParams,
} from "./update-condition"
import {
  AdminPostDiscountsDiscountConditions,
  AdminPostDiscountsDiscountConditionsParams,
} from "./create-condition"
import { AdminPostDiscountsDiscountDynamicCodesReq } from "./create-dynamic-code"
import {
  AdminPostDiscountsDiscountParams,
  AdminPostDiscountsDiscountReq,
} from "./update-discount"
import {
  AdminPostDiscountsParams,
  AdminPostDiscountsReq,
} from "./create-discount"
import { AdminGetDiscountsParams } from "./list-discounts"
import { AdminGetDiscountsDiscountConditionsConditionParams } from "./get-condition"
import { AdminDeleteDiscountsDiscountConditionsConditionParams } from "./delete-condition"
import { AdminGetDiscountsDiscountCodeParams } from "./get-discount-by-code"
import { AdminGetDiscountParams } from "./get-discount"
import {
  AdminDeleteDiscountsDiscountConditionsConditionBatchParams,
  AdminDeleteDiscountsDiscountConditionsConditionBatchReq,
} from "./delete-resources-from-condition-batch"

const route = Router()

export default (app) => {
  app.use("/discounts", route)

  route.get(
    "/",
    transformQuery(AdminGetDiscountsParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: true,
    }),
    middlewares.wrap(require("./list-discounts").default)
  )
  route.post(
    "/",
    transformQuery(AdminPostDiscountsParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminPostDiscountsReq),
    middlewares.wrap(require("./create-discount").default)
  )

  route.get(
    "/:discount_id",
    transformQuery(AdminGetDiscountParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-discount").default)
  )
  route.get(
    "/code/:code",
    transformQuery(AdminGetDiscountsDiscountCodeParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-discount-by-code").default)
  )
  route.post(
    "/:discount_id",
    transformQuery(AdminPostDiscountsDiscountParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminPostDiscountsDiscountReq),
    middlewares.wrap(require("./update-discount").default)
  )
  route.delete(
    "/:discount_id",
    middlewares.wrap(require("./delete-discount").default)
  )

  // Dynamic codes
  route.post(
    "/:discount_id/dynamic-codes",
    transformBody(AdminPostDiscountsDiscountDynamicCodesReq),
    middlewares.wrap(require("./create-dynamic-code").default)
  )
  route.delete(
    "/:discount_id/dynamic-codes/:code",
    middlewares.wrap(require("./delete-dynamic-code").default)
  )

  // Discount region management
  route.post(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./add-region").default)
  )
  route.delete(
    "/:discount_id/regions/:region_id",
    middlewares.wrap(require("./remove-region").default)
  )

  // Discount condition management
  route.post(
    "/:discount_id/conditions",
    transformQuery(AdminPostDiscountsDiscountConditionsParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminPostDiscountsDiscountConditions),
    middlewares.wrap(require("./create-condition").default)
  )

  route.delete(
    "/:discount_id/conditions/:condition_id",
    transformQuery(AdminDeleteDiscountsDiscountConditionsConditionParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    middlewares.wrap(require("./delete-condition").default)
  )

  const conditionRouter = Router({ mergeParams: true })
  route.use(
    "/:discount_id/conditions/:condition_id",
    doesConditionBelongToDiscount,
    conditionRouter
  )

  conditionRouter.get(
    "/",
    transformQuery(AdminGetDiscountsDiscountConditionsConditionParams, {
      defaultFields: defaultAdminDiscountConditionFields,
      defaultRelations: defaultAdminDiscountConditionRelations,
      isList: false,
    }),
    middlewares.wrap(require("./get-condition").default)
  )
  conditionRouter.post(
    "/",
    transformQuery(AdminPostDiscountsDiscountConditionsConditionParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminPostDiscountsDiscountConditionsCondition),
    middlewares.wrap(require("./update-condition").default)
  )
  conditionRouter.post(
    "/batch",
    transformQuery(AdminPostDiscountsDiscountConditionsConditionBatchParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminPostDiscountsDiscountConditionsConditionBatchReq),
    middlewares.wrap(require("./add-resources-to-condition-batch").default)
  )
  conditionRouter.delete(
    "/batch",
    transformQuery(AdminDeleteDiscountsDiscountConditionsConditionBatchParams, {
      defaultFields: defaultAdminDiscountsFields,
      defaultRelations: defaultAdminDiscountsRelations,
      isList: false,
    }),
    transformBody(AdminDeleteDiscountsDiscountConditionsConditionBatchReq),
    middlewares.wrap(require("./delete-resources-from-condition-batch").default)
  )

  return app
}

export const defaultAdminDiscountsFields: (keyof Discount)[] = [
  "id",
  "code",
  "is_dynamic",
  "is_disabled",
  "rule_id",
  "parent_discount_id",
  "usage_limit",
  "usage_count",
  "starts_at",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
  "valid_duration",
]

export const defaultAdminDiscountsRelations = [
  "rule",
  "parent_discount",
  "regions",
  "rule.conditions",
]

export const defaultAdminDiscountConditionFields: (keyof DiscountCondition)[] =
  ["id", "type", "operator", "discount_rule_id", "created_at", "updated_at"]

export const defaultAdminDiscountConditionRelations = ["discount_rule"]

/**
 * @schema AdminDiscountsRes
 * type: object
 * properties:
 *   discount:
 *     $ref: "#/components/schemas/Discount"
 */
export type AdminDiscountsRes = {
  discount: Discount
}

/**
 * @schema AdminDiscountConditionsRes
 * type: object
 * properties:
 *   discount_condition:
 *     $ref: "#/components/schemas/DiscountCondition"
 */
export type AdminDiscountConditionsRes = {
  discount_condition: DiscountCondition
}

/**
 * @schema AdminDiscountsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Discount
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: discount
 *   deleted:
 *     type: boolean
 *     description: Whether the discount was deleted successfully or not.
 *     default: true
 */
export type AdminDiscountsDeleteRes = DeleteResponse

/**
 * @schema AdminDiscountConditionsDeleteRes
 * type: object
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted DiscountCondition
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: discount-condition
 *   deleted:
 *     type: boolean
 *     description: Whether the discount condition was deleted successfully or not.
 *     default: true
 *   discount:
 *     description: The Discount to which the condition used to belong
 *     $ref: "#/components/schemas/Discount"
 */
export type AdminDiscountConditionsDeleteRes = DeleteResponse & {
  discount: Discount
}

/**
 * @schema AdminDiscountsListRes
 * type: object
 * properties:
 *   discounts:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Discount"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminDiscountsListRes = PaginatedResponse & {
  discounts: Discount[]
}

export * from "./add-region"
export * from "./create-condition"
export * from "./create-discount"
export * from "./create-dynamic-code"
export * from "./delete-condition"
export * from "./delete-discount"
export * from "./delete-dynamic-code"
export * from "./get-condition"
export * from "./get-discount"
export * from "./get-discount-by-code"
export * from "./list-discounts"
export * from "./remove-region"
export * from "./update-condition"
export * from "./update-discount"
export * from "./add-resources-to-condition-batch"
export * from "./delete-resources-from-condition-batch"
