import { buildRoleAssignmentCacheTag, Modules } from "@medusajs/framework/utils"
import {
  ICachingModuleService,
  MedusaContainer,
} from "@medusajs/framework/types"

/**
 * Invalidates the cached resolved-roles entries tied to the given
 * `(reference, reference_id)` pairs so affected actor roles
 * are re-resolved on their next request.
 *
 * @ignore
 * @featureFlag rbac
 */
export async function invalidateRoleAssignmentCache(
  container: MedusaContainer,
  pairs: { reference: string; reference_id: string }[]
): Promise<void> {
  if (!pairs?.length) {
    return
  }

  const cachingModule = container.resolve<ICachingModuleService>(
    Modules.CACHING
  )

  const tags = Array.from(
    new Set(
      pairs.map(({ reference, reference_id }) =>
        buildRoleAssignmentCacheTag(reference, reference_id)
      )
    )
  )

  try {
    await cachingModule.clear({ tags })
  } catch {
    // Cache invalidation is best-effort; never fail the mutation because of it.
  }
}
