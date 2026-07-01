import { INJECTION_ZONES } from "./constants"
import { InjectionZone } from "./types"

/**
 * Validates that the provided zone is a valid injection zone for a widget.
 */
export function isValidInjectionZone(zone: any): zone is InjectionZone {
  if (typeof zone !== "string") return false
  if (INJECTION_ZONES.includes(zone as any)) return true
  console.warn(
    `The injection zone "${zone}" is not a core injection zone. Custom zones are not validated, verify it is correct.`
  )
  return true
}
