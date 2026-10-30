import type { Permission } from "./types"

/**
 * Thrown by a route loader when the user lacks the permissions required to
 * access the route. Carries the required permissions so the error boundary can
 * render an access-denied screen that lists them.
 */
export class PermissionError extends Error {
  readonly permissions: Permission[]
  readonly requireAll: boolean

  constructor(permissions: Permission[], requireAll: boolean = true) {
    super("Access denied")
    this.name = "PermissionError"
    this.permissions = permissions
    this.requireAll = requireAll
  }
}

export function isPermissionError(error: unknown): error is PermissionError {
  return error instanceof PermissionError
}
