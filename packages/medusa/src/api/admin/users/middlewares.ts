import * as QueryConfig from "./query-config"

import {
  AdminCreateUser,
  AdminGetUserParams,
  AdminGetUsersParams,
  AdminUpdateUser,
} from "./validators"

import { MiddlewareRoute } from "@medusajs/framework"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { validateAndTransformBody } from "../../utils/validate-body"

// TODO: Due to issues with our routing (and using router.use for applying middlewares), we have to opt-out of global auth in all routes, and then reapply it here.
// See https://medusacorp.slack.com/archives/C025KMS13SA/p1716455350491879 for details.
export const adminUserRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      authenticate("user", ["bearer", "session"]),
      validateAndTransformQuery(
        AdminGetUsersParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users",
    middlewares: [
      authenticate("user", ["bearer", "session"], { allowUnregistered: true }),
      validateAndTransformBody(AdminCreateUser),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id",
    middlewares: [
      authenticate("user", ["bearer", "session"]),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/me",
    middlewares: [
      authenticate("user", ["bearer", "session"]),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id",
    middlewares: [
      authenticate("user", ["bearer", "session"]),
      validateAndTransformBody(AdminUpdateUser),
      validateAndTransformQuery(
        AdminGetUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/users/:id",
    middlewares: [authenticate("user", ["bearer", "session"])],
  },
]
