import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminCreateUserRequest,
  AdminGetUsersParams,
  AdminGetUsersUserParams,
} from "./validators"
import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../types/middlewares"

export const adminUserRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/users",
    middlewares: [
      transformQuery(AdminGetUsersParams, QueryConfig.listTransformQueryConfig),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/users",
    middlewares: [transformBody(AdminCreateUserRequest)],
  },
  {
    method: ["GET"],
    matcher: "/admin/users/:id",
    middlewares: [
      transformQuery(
        AdminGetUsersUserParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  // {
  //   method: ["POST"],
  //   matcher: "/admin/users/:id",
  //   middlewares: [transformBody(AdminPostUsersUserReq)],
  // },
]
