import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

import { useUsers } from "../../../hooks/api/users"
import { useUserPermissions } from "../../../hooks/use-resource-permissions"

export type AuditLogActorUser = Pick<
  HttpTypes.AdminUser,
  "id" | "email" | "first_name" | "last_name"
>

const ACTOR_USER_FIELDS = "id,email,first_name,last_name"

export const getActorUserName = (user: AuditLogActorUser) =>
  [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email

/**
 * Resolves the users behind `user` actors in one request. Actors that can't be
 * resolved (deleted users, or no `user:read` with RBAC) are left out, so
 * callers fall back to the actor ID.
 */
export const useAuditLogActorUsers = (
  auditLogs?: Pick<HttpTypes.AdminAuditLog, "actor_type" | "actor_id">[]
) => {
  const { canRead } = useUserPermissions()

  const ids = useMemo(
    () =>
      [
        ...new Set(
          (auditLogs ?? [])
            .filter((log) => log.actor_type === "user" && log.actor_id)
            .map((log) => log.actor_id!)
        ),
      ].sort(),
    [auditLogs]
  )

  const { users } = useUsers(
    { id: ids, fields: ACTOR_USER_FIELDS, limit: ids.length },
    { enabled: canRead && ids.length > 0 }
  )

  return useMemo(
    () =>
      new Map<string, AuditLogActorUser>(
        (users ?? []).map((user) => [user.id, user])
      ),
    [users]
  )
}
