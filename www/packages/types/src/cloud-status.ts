/**
 * The overall status indicators reported by the Medusa Cloud status page.
 */
export type CloudStatusIndicator =
  | "none"
  | "minor"
  | "major"
  | "critical"
  | "maintenance"

export type CloudStatus = {
  indicator: CloudStatusIndicator
  description: string
}
