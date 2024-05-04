export interface WithExtendedRelationsExtension {
  "x-expanded-relations"?: {
    field: string
    relations?: string[]
    totals?: string[]
    implicit?: string[]
    eager?: string[]
  }
}
