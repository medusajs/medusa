import { validateAndTransformQuery } from "@medusajs/framework"
import {
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { PolicyOperation } from "@medusajs/framework/utils"
import multer from "multer"
import { Entities, retrieveUploadConfig } from "./query-config"
import { AdminGetUploadParams, AdminUploadPreSignedUrl } from "./validators"

// TODO: For now we keep the files in memory, as that's how they get passed to the workflows
// This will need revisiting once we are closer to prod-ready v2, since with workflows and potentially
// services on other machines using streams is not as simple as it used to be.
const upload = multer({ storage: multer.memoryStorage() })

export const adminUploadRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/uploads/*",
    policies: [
      {
        resource: Entities.file,
        operation: PolicyOperation.read,
      },
    ],
  },
  // TODO: There is a `/protected` route in v1 that might need a bit more thought when implementing
  {
    method: ["POST"],
    matcher: "/admin/uploads",
    middlewares: [
      upload.array("files"),
      validateAndTransformQuery(AdminGetUploadParams, retrieveUploadConfig),
    ],
    policies: [
      {
        resource: Entities.file,
        operation: PolicyOperation.create,
      },
    ],
  },
  {
    method: ["GET"],
    matcher: "/admin/uploads/:id",
    middlewares: [
      validateAndTransformQuery(AdminGetUploadParams, retrieveUploadConfig),
    ],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/uploads/:id",
    middlewares: [],
    policies: [
      {
        resource: Entities.file,
        operation: PolicyOperation.delete,
      },
    ],
  },
  {
    method: ["POST"],
    matcher: "/admin/uploads/presigned-urls",
    middlewares: [validateAndTransformBody(AdminUploadPreSignedUrl)],
    policies: [
      {
        resource: Entities.file,
        operation: PolicyOperation.create,
      },
    ],
  },
]
