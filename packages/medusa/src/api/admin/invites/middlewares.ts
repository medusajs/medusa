import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"

import {
  AdminCreateInvite,
  AdminCreateInviteType,
  AdminGetInviteAcceptParams,
  AdminGetInviteParams,
  AdminGetInvitesParams,
  AdminInviteAccept,
} from "./validators"

import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import {
  authorize,
  authorizeIfNecessary,
  MiddlewareRoute,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import { authenticate } from "../../../utils/middlewares/authenticate-middleware"
import { createdAuditResource } from "../../utils/audit"

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
    audit: {
      action: "invite.create",
      resource: createdAuditResource("invite"),
    },
    middlewares: [
      authorize([
        {
          resource: Entities.invite,
          operation: PolicyOperation.create,
        },
      ]),
      validateAndTransformBody(AdminCreateInvite),
      authorizeIfNecessary<AdminCreateInviteType>(
        (req) => !!req.validatedBody?.roles?.length,
        {
          resource: "rbac_role_assignment",
          operation: PolicyOperation.create,
        }
      ),
      validateAndTransformQuery(
        AdminGetInviteParams,
        QueryConfig.retrieveTransformQueryConfig
      ),
    ],
  },
  {
    method: "POST",
    matcher: "/admin/invites/accept",
    audit: {
      action: "invite.accept",
      resource: createdAuditResource("user"),
    },
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
    audit: { action: "invite.resend" },
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
