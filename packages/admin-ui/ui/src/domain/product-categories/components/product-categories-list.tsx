import { dropRight, flatMap, get } from "lodash"
import React, { useCallback, useMemo } from "react"
import Nestable from "react-nestable"

import "react-nestable/dist/styles/index.css"
import "../styles/product-categories.css"

import { ProductCategory } from "@medusajs/medusa"
import { adminProductCategoryKeys, useMedusa } from "medusa-react"

import { useQueryClient } from "@tanstack/react-query"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import TriangleMiniIcon from "../../../components/fundamentals/icons/triangle-mini-icon"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import ProductCategoryListItemDetails from "./product-category-list-item-details"

type ProductCategoriesListProps = {
  categories: ProductCategory[]
}

/**
 * Draggable list that renders product categories tree view.
 */
function ProductCategoriesList(props: ProductCategoriesListProps) {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  const notification = useNotification()
  const [isUpdating, enableUpdating, disableUpdating] = useToggleState(false)
  const [isError, enableError, disableError] = useToggleState(false)
  const { categories } = props

  const onItemDrop = useCallback(
    async (params: {
      item: ProductCategory
      items: ProductCategory[]
      path: number[]
    }) => {
      enableUpdating()
      let parentId = null
      const { dragItem, items, targetPath } = params
      const [rank] = targetPath.slice(-1)

      if (targetPath.length > 1) {
        const path = dropRight(
          flatMap(targetPath.slice(0, -1), (item) => [
            item,
            "category_children",
          ])
        )

        const newParent = get(items, path)
        parentId = newParent.id
      }

      try {
        disableError()

        await client.admin.productCategories.update(dragItem.id, {
          parent_category_id: parentId,
          rank,
        })
        notification("Success", "Successfully updated category tree", "success")
      } catch (e) {
        notification("Error", "Failed to update category tree", "error")
        enableError()
      } finally {
        await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
        disableUpdating()
      }
    },
    []
  )

  const NestableList = useMemo(
    () => (
      <Nestable
        items={categories}
        collapsed={true}
        onChange={onItemDrop}
        childrenProp="category_children"
        // Adding an unreasonably high number here to prevent us from
        // setting a hard limit  on category depth. This should be decided upon
        // by consumers of medusa after considering the pros and cons to the approach
        maxDepth={99}
        renderItem={({ item, depth, handler, collapseIcon }) => (
          <ProductCategoryListItemDetails
            item={item}
            depth={depth}
            handler={handler}
            collapseIcon={collapseIcon}
          />
        )}
        handler={<ReorderIcon className="cursor-grab" color="#889096" />}
        renderCollapseIcon={({ isCollapsed }) => (
          <TriangleMiniIcon
            style={{
              top: -2,
              width: 32,
              left: -12,
              transform: !isCollapsed ? "" : "rotate(270deg)",
            }}
            color="#889096"
            size={18}
          />
        )}
      />
    ),
    [categories, isError]
  )

  return (
    <div
      style={{
        pointerEvents: isUpdating ? "none" : "initial",
        position: "relative",
      }}
    >
      {NestableList}
      {isUpdating && (
        <div
          style={{
            top: 0,
            bottom: 0,
            width: "100%",
            cursor: "progress",
            position: "absolute",
          }}
        />
      )}
    </div>
  )
}

export default React.memo(ProductCategoriesList) // Memo prevents list flicker on reorder
