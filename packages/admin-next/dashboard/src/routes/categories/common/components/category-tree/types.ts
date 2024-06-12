export type CategoryTreeItem = {
  id: string
  name: string
  parent_category_id: string | null
  category_children: CategoryTreeItem[] | null
  rank: number | null
}
