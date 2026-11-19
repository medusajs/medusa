import { FetchError } from "@medusajs/js-sdk"

import {
  AUDIT_MODULE_KEY,
  isModuleInstalled,
  modulesQueryOptions,
} from "../../../hooks/api/modules"
import { queryClient } from "../../../lib/query-client"

/**
 * Guards the audit log routes. Without the Audit Module the API routes don't
 * exist, so a direct URL renders the not-found screen instead of failing.
 */
export const auditModuleLoader = async () => {
  const { modules } = await queryClient.ensureQueryData(modulesQueryOptions)

  if (!isModuleInstalled(modules, AUDIT_MODULE_KEY)) {
    throw new FetchError("Audit Module is not installed", "Not Found", 404)
  }

  return null
}
