import { DotsSix, Folder, Swatch, TriangleRightMini } from "@medusajs/icons"
import type { ProductCategory } from "@medusajs/medusa"
import { FocusModal, IconButton, clx } from "@medusajs/ui"
import dropRight from "lodash/dropRight"
import flatMap from "lodash/flatMap"
import get from "lodash/get"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import Nestable from "react-nestable"
import * as zod from "zod"

import { adminProductCategoryKeys } from "medusa-react"
import "react-nestable/dist/styles/index.css"
import { medusa, queryClient } from "../../../../../lib/medusa"
import "./styles.css"

type CategoryTreeProps = {
  categories: ProductCategory[]
}

const CategoryTreeSchema = zod.object({})

const MAX_DEPTH = 99

export const CategoryTree = ({ categories }: CategoryTreeProps) => {
  const { t } = useTranslation()

  const onChange = async ({
    dragItem,
    items,
    targetPath,
  }: {
    dragItem: ProductCategory
    items: ProductCategory[]
    targetPath: number[]
  }) => {
    let parentId = null
    const [rank] = targetPath.slice(-1)

    if (targetPath.length > 1) {
      const path = dropRight(
        flatMap(targetPath.slice(0, -1), (item) => [item, "category_children"])
      )

      const newParent = get(items, path) as ProductCategory
      parentId = newParent.id
    }

    await medusa.admin.productCategories
      .update(dragItem.id, {
        parent_category_id: parentId,
        rank,
      })
      .finally(() => {
        queryClient.invalidateQueries(adminProductCategoryKeys.lists())
      })
  }

  return (
    <div className="flex flex-col">
      <FocusModal.Header />
      <FocusModal.Body>
        <div className="txt-compact-small relative flex-1 overflow-y-auto">
          <Nestable
            items={categories}
            childrenProp="category_children"
            maxDepth={MAX_DEPTH}
            onChange={({ dragItem, items, targetPath }) =>
              onChange({
                dragItem: dragItem as ProductCategory,
                items: items as ProductCategory[],
                targetPath,
              })
            }
            renderItem={({ index, item, ...props }) => {
              return (
                <Leaf key={index} item={item as ProductCategory} {...props} />
              )
            }}
            handler={<DragHandle />}
            renderCollapseIcon={({ isCollapsed }) => {
              return (
                <IconButton size="small" variant="transparent">
                  <TriangleRightMini
                    className={clx({
                      "transform rotate-90 transition-transform": !isCollapsed,
                    })}
                  />
                </IconButton>
              )
            }}
          />
        </div>
      </FocusModal.Body>
    </div>
  )
}

type LeafProps = {
  item: ProductCategory
  depth: number
  isDraggable: boolean
  collapseIcon: ReactNode
  handler: ReactNode
}

const Leaf = ({ item, depth, collapseIcon, handler }: LeafProps) => {
  const hasChildren = !!item.category_children?.length

  return (
    <div className="flex items-center px-6 py-2.5 border-b gap-x-3 h-12 bg-ui-bg-base">
      <div>{handler}</div>
      {Array.from({ length: depth }).map((_, i) => (
        <div key={`offset_${i}`} role="presentation" className="w-7 h-7" />
      ))}
      <div className="w-7 h-7">{collapseIcon}</div>
      <div
        className="flex items-center justify-center text-ui-fg-muted w-7 h-7"
        role="presentation"
      >
        {hasChildren ? <Folder /> : <Swatch />}
      </div>
      <div>{item.name}</div>
    </div>
  )
}

const DragHandle = () => {
  return (
    <div className="cursor-grab active:cursor-grabbing w-7 h-7 flex items-center justify-center">
      <DotsSix className="text-ui-fg-subtle" />
    </div>
  )
}
