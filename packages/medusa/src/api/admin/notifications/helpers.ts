import { AuthenticatedMedusaRequest } from "@medusajs/framework/http"

export const scopeFeedToActor = (
  req: AuthenticatedMedusaRequest,
  filters: Record<string, unknown> = {}
) => {
  // Free-text search is only applied when `q` is a top-level filter.
  const { q, ...rest } = filters

  return {
    ...(q !== undefined ? { q } : {}),
    $and: [
      rest,
      {
        $or: [
          { channel: { $ne: "feed" } },
          { to: [req.auth_context.actor_id, ""] },
        ],
      },
    ],
  }
}
