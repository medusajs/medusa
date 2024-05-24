import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import {
  AdminCreateCustomerGroup,
  AdminGetCustomerGroupParams,
  AdminGetCustomerGroupsParams,
  AdminUpdateCustomerGroup,
} from "./validators"
import { validateAndTransformBody } from "../../utils/validate-body"
import { createLinkBody } from "../../utils/validators"

export const adminCustomerGroupRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/customer-groups*",
    middlewares: [authenticate("user", ["bearer", "session", "api-key"])],
  },
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
]
