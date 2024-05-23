import * as QueryConfig from "./query-config"

import {
  AdminCreateInvite,
  AdminGetInviteAcceptParams,
  AdminGetInviteParams,
  AdminGetInvitesParams,
  AdminInviteAccept,
} from "./validators"

import { MiddlewareRoute } from "../../../types/middlewares"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { validateAndTransformQuery } from "../../utils/validate-query"
import { validateAndTransformBody } from "../../utils/validate-body"

export const adminInviteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/invites",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      validateAndTransformQuery(
        AdminGetInvitesParams,
        QueryConfig.listTransformQueryConfig
      ),
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/invites",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      validateAndTransformBody(AdminCreateInvite),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/invites/accept",
    middlewares: [
      authenticate("user", ["session", "bearer"], {
        allowUnregistered: true,
      }),
      validateAndTransformBody(AdminInviteAccept),
      validateAndTransformQuery(
        AdminGetInviteAcceptParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/invites/:id",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/invites/:id",
    middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
  },
  {
    method: "POST",
    matcher: "/admin/invites/:id/resend",
    middlewares: [
      authenticate("user", ["session", "bearer", "api-key"]),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
