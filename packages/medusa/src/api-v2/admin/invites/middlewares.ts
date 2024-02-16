import { transformBody, transformQuery } from "../../../api/middlewares"
import {
  AdminCreateInviteRequest,
  AdminGetInvitesParams,
  AdminGetInvitesInviteParams,
  AdminPostInvitesInviteAcceptReq,
  AdminPostInvitesInviteAcceptParams,
} from "./validators"
import * as QueryConfig from "./query-config"
import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/authenticate-middleware"

export const adminInviteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: "ALL",
    matcher: "/admin/invites*",
    middlewares: [authenticate("admin", ["session", "bearer"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/invites",
    middlewares: [
      transformQuery(
        AdminGetInvitesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/invites",
    middlewares: [transformBody(AdminCreateInviteRequest)],
  },
  {
    method: ["POST"],
    matcher: "/admin/invites/accept",
    middlewares: [
      transformBody(AdminPostInvitesInviteAcceptReq),
      transformQuery(AdminPostInvitesInviteAcceptParams),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/invites/:id",
    middlewares: [
      transformQuery(
        AdminGetInvitesInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
