import { INJECTION_ZONES } from "./constants"
import { InjectionZone } from "./types"

/**
 * Validates that the provided zone is a valid injection zone for a widget.
 */
export function isValidInjectionZone(zone: any): zone is InjectionZone {
  return INJECTION_ZONES.includes(zone)
}
