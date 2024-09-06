export interface IFilter {
  filter: {
    key: string
    label: string
  }
  readonly?: boolean
  openOnMount?: boolean
  prefix?: string
}
