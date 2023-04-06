import type { Model } from "./Model"

export interface ModelComposition {
  type: "one-of" | "any-of" | "all-of"
  imports: string[]
  enums: Model[]
  properties: Model[]
}
