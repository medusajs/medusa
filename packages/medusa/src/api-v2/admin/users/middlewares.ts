import * as QueryConfig from "./query-config"

import {
  AdminCreateUser,
  AdminGetUserParams,
  AdminGetUsersParams,
  AdminUpdateUser,
} from "./validators"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminUserRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      authenticate("admin", ["bearer", "session"]),
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
      authenticate("admin", ["bearer", "session"], { allowUnregistered: true }),
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
      authenticate("admin", ["bearer", "session"]),
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
      authenticate("admin", ["bearer", "session"]),
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
      authenticate("admin", ["bearer", "session"]),
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
    middlewares: [authenticate("admin", ["bearer", "session"])],
  },
]
