export interface DataTableFilterProps {
  filter: {
    key: string
    label: string
  }
  openOnMount?: boolean
  prefix?: string
}

export type DataTableSelectFilterOption = {
  label: string
  value: unknown
}

export type DataTableFilter = {
  key: string
  label: string
} & (
  | {
      type: "select"
      options: DataTableSelectFilterOption[]
      multiple?: boolean
    }
  | {
      type: "date"
      options?: never
    }
)
