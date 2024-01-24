import {
  findSidebarCategory,
  useDocsSidebar,
} from "@docusaurus/theme-common/internal"
import { PropSidebarItem } from "@docusaurus/plugin-content-docs"

type Options = {
  categoryLabel?: string
  categoryCustomId?: string
}

export function getCategoryItems({ categoryLabel, categoryCustomId }: Options) {
  return findSidebarCategory(
    useDocsSidebar().items,
    (item) =>
      item.label === categoryLabel ||
      item.customProps.category_id === categoryCustomId
  )?.items
}

export default function getFirstCategoryItem(
  options: Options
): PropSidebarItem | undefined {
  return getCategoryItems(options)?.[0]
}
