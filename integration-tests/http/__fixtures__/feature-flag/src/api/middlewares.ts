import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@zjedene-medusa/framework/http"
import { z } from "@zjedene-medusa/framework/zod"

const CustomPostSchema = z.object({
  foo: z.string(),
})

export default defineMiddlewares({
  routes: [
    {
      method: ["POST"],
      matcher: "/custom",
      middlewares: [validateAndTransformBody(CustomPostSchema)],
    },
  ],
})
