import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  AdminCreateInvite,
  AdminGetInviteAcceptParams,
  AdminGetInviteParams,
  AdminGetInvitesParams,
  AdminInviteAccept,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { authorize, MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"

export const adminInviteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/invites",
    middlewares: [
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.read,
        },
      ]),
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
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.create,
        },
      ]),
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
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.read,
        },
      ]),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/invites/:id",
    middlewares: [
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.delete,
        },
      ]),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/invites/:id/resend",
    middlewares: [
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.update,
        },
      ]),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
]
