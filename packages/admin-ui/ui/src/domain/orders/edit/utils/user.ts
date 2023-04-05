import { OrderEdit } from "@medusajs/medusa"

const USER_PREFIX = "usr"

/**
 * Returns true if the order edit has been declined by an admin.
 */
function isDeclinedByUser(edit: OrderEdit) {
  return !!edit.declined_by?.startsWith(USER_PREFIX)
}

/**
 * Returns true if the order edit has been confirmed by an admin.
 */
function isConfirmedByUser(edit: OrderEdit) {
  return !!edit.confirmed_by?.startsWith(USER_PREFIX)
}

export { isConfirmedByUser, isDeclinedByUser }
