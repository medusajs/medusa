import * as QueryConfig from "./query-config"

import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminCreateUserRequest,
  AdminGetUsersParams,
  AdminGetUsersUserParams,
  AdminUpdateUserRequest,
} from "./validators"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminUserRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      authenticate("admin", ["bearer", "session"]),
      transformQuery(AdminGetUsersParams, QueryConfig.listTransformQueryConfig),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users",
    middlewares: [
      authenticate("admin", ["bearer", "session"], { allowUnregistered: true }),
      transformBody(AdminCreateUserRequest),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id",
    middlewares: [
      authenticate("admin", ["bearer", "session"]),
      transformQuery(
        AdminGetUsersUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/me",
    middlewares: [
      authenticate("admin", ["bearer", "session"]),
      transformQuery(
        AdminGetUsersUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users/:id",
    middlewares: [
      authenticate("admin", ["bearer", "session"]),
      transformBody(AdminUpdateUserRequest),
    ],
  },
]
