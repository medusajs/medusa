import {
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework"
import { MiddlewareRoute } from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import * as QueryConfig from "./query-config"
import { Entities } from "./query-config"
import { AdminCreateNote, AdminGetNotesParams } from "./validators"

export const adminNoteRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/notes/*",
    policies: [
      {
        resource: Entities.note,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/notes",
    middlewares: [
      validateAndTransformQuery(
        AdminGetNotesParams,
        QueryConfig.listNotesTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.note,
        operation: PolicyOperation.read,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/notes",
    middlewares: [
      validateAndTransformBody(AdminCreateNote),
      validateAndTransformQuery(
        AdminGetNotesParams,
        QueryConfig.retrieveNoteTransformQueryConfig
      ),
    ],
    policies: [
      {
        resource: Entities.note,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/notes/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.note,
        operation: PolicyOperation.delete,
      },
    ],
  },
]
