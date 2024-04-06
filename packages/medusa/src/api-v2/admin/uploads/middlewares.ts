import multer from "multer"
import { MiddlewareRoute } from "../../../loaders/helpers/routing/types"
import { authenticate } from "../../../utils/authenticate-middleware"

const upload = multer({ dest: "uploads/" })

export const adminUploadRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ["ALL"],
    matcher: "/admin/uploads*",
    middlewares: [authenticate("admin", ["bearer", "session", "api-key"])],
  },
  {
    method: ["GET"],
    matcher: "/admin/uploads/:id",
    middlewares: [],
  },
  // TODO: There is a `/protected` route in v1 that might need a bit more thought when implementing
  {
    method: ["POST"],
    matcher: "/admin/uploads",
    middlewares: [upload.array("files")],
  },
  {
    method: ["DELETE"],
    matcher: "/admin/uploads/:id",
    middlewares: [],
  },
]
