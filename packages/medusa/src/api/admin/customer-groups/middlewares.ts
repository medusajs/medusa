import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { validateAndTransformBody } from "../../utils/validate-body"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { createLinkBody } from "../../utils/validators"
import * as CustomerQueryConfig from "../customers/query-config"
import { AdminCustomersParams } from "../customers/validators"
import * as QueryConfig from "./query-config"
import {
  AdminCreateCustomerGroup,
  AdminGetCustomerGroupParams,
  AdminGetCustomerGroupsParams,
  AdminUpdateCustomerGroup,
} from "./validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupsParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups",
    middlewares: [
      validateAndTransformBody(AdminCreateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id",
    middlewares: [
      validateAndTransformBody(AdminUpdateCustomerGroup),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      validateAndTransformBody(createLinkBody()),
      validateAndTransformQuery(
        AdminGetCustomerGroupParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/customer-groups/:id/customers",
    middlewares: [
      validateAndTransformQuery(
        AdminCustomersParams,
        CustomerQueryConfig.listTransformQueryConfig
      ),
    ],
  },
]
