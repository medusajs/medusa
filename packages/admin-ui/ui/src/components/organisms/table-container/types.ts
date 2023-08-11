export type PagingProps = {
  title: string
  currentPage: number
  pageSize: number
  pageCount: number
  count: number
  offset: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: () => void
  prevPage: () => void
}
