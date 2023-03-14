import { findSidebarCategory, useDocsSidebar } from '@docusaurus/theme-common/internal';
import { PropSidebarItem } from '@docusaurus/plugin-content-docs';

export default function getFirstCategoryItem (categoryLabel: string): PropSidebarItem | undefined {
  return findSidebarCategory(useDocsSidebar().items, (item) => item.label === categoryLabel)?.items[0];
}