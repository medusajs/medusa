export interface AdminCreatePropertyLabel {
  entity: string
  property: string
  label: string
  description?: string | null | undefined
}

export interface AdminUpdatePropertyLabel {
  label?: string | undefined
  description?: string | null | undefined
}

export interface AdminBatchPropertyLabels {
  create?:
    | {
        entity: string
        property: string
        label: string
        description?: string | null | undefined
      }[]
    | undefined
  update?:
    | {
        id: string
        label?: string | undefined
        description?: string | null | undefined
      }[]
    | undefined
  delete?: string[] | undefined
}
