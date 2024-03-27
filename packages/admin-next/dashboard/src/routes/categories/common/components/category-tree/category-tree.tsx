import { ProductCategory } from "@medusajs/medusa"
import Nestable, { Item } from "react-nestable"

import { CategoryTreeBranch } from "./category-tree-branch"
import { CategoryTreeCollapseIcon } from "./category-tree-collapse-icon"
import { CategoryTreeDragHandle } from "./category-tree-drag-handle"
import { ItemMenuCompoment, OnChangeFn } from "./types"

import { useRef } from "react"
import "react-nestable/dist/styles/index.css"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import "./styles.css"
/**
 * An arbitrary number to limit the depth of the category tree.
 *
 * Copied over from the old dashboard. Temporary until the API
 * supports a better Categories UI.
 */
const MAX_DEPTH = 99

type CategoryTreeProps = {
  productCategories?: ProductCategory[]
  onChange: OnChangeFn
  itemMenu?: ItemMenuCompoment
  enableDrag?: (item: ProductCategory) => boolean
  isLoading: boolean
  asLink?: boolean
}

export const CategoryTree = ({
  productCategories,
  onChange,
  itemMenu,
  enableDrag,
  isLoading,
  asLink,
}: CategoryTreeProps) => {
  const ref = useRef<Nestable>(null)

  /**
   * The Nestable component does not allow us to prevent propagation of
   * the click event on the collapse icon. This is a workaround that manages
   * the collapsed state manually. Which allows us to override the default
   * onClick handler on the collapse icon.
   */
  const handleToggle = (item: Item) => {
    if (ref.current) {
      const isCollapsed = ref.current.checkIfCollapsed(item)

      if (isCollapsed) {
        const { collapsedItems, ...rest } = ref.current.state

        const update = collapsedItems.filter((i: any) => i !== item.id)

        return ref.current.setState({
          ...rest,
          collapsedItems: update,
        })
      }

      ref.current.collapse([item.id])
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col">
        {Array.from({ length: 10 }).map((_, i) => (
          <NestedItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!productCategories) {
    return <NoRecords />
  }

  return (
    <div className="txt-compact-small relative flex-1 overflow-y-auto">
      <Nestable
        ref={ref}
        items={productCategories}
        childrenProp="category_children"
        maxDepth={MAX_DEPTH}
        onChange={({ dragItem, items, targetPath }) =>
          onChange({
            dragItem: dragItem as ProductCategory,
            items: items as ProductCategory[],
            targetPath,
          })
        }
        disableDrag={
          enableDrag
            ? ({ item }) => {
                return enableDrag(item as ProductCategory)
              }
            : undefined
        }
        renderItem={({ index, item, ...props }) => {
          const isEnabled = enableDrag
            ? enableDrag(item as ProductCategory)
            : true

          return (
            <CategoryTreeBranch
              key={index}
              item={item as ProductCategory}
              menu={itemMenu}
              isEnabled={isEnabled}
              asLink={asLink}
              isLast={index === productCategories.length - 1}
              {...props}
            />
          )
        }}
        handler={<CategoryTreeDragHandle />}
        renderCollapseIcon={({ isCollapsed, item }) => {
          return (
            <CategoryTreeCollapseIcon
              isCollapsed={isCollapsed}
              item={item}
              toggle={handleToggle}
            />
          )
        }}
        threshold={10}
      />
    </div>
  )
}

const NestedItemSkeleton = () => {
  return <div className="bg-ui-bg-subtle h-12 w-full animate-pulse border-b" />
}
