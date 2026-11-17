import { AuthenticatedMedusaRequest } from "@medusajs/framework/http"

export const scopeFeedToActor = (
  req: AuthenticatedMedusaRequest,
  filters: Record<string, unknown> = {}
) => {
  return {
    $and: [
      filters,
      {
        $or: [
          { channel: { $ne: "feed" } },
          { to: [req.auth_context.actor_id, ""] },
        ],
      },
    ],
  }
}
