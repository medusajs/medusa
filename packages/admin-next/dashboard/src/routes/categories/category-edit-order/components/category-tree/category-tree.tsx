import { DotsSix, Folder, Swatch, TriangleRightMini } from "@medusajs/icons"
import type { ProductCategory } from "@medusajs/medusa"
import { Button, FocusModal, IconButton, clx } from "@medusajs/ui"
import { ReactNode } from "react"
import Nestable from "react-nestable"

import { useTranslation } from "react-i18next"
import "react-nestable/dist/styles/index.css"
import "./styles.css"

type CategoryTreeProps = {
  categories: ProductCategory[]
}

const MAX_DEPTH = 99

export const CategoryTree = ({ categories }: CategoryTreeProps) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <FocusModal.Header>
        <div className="flex items-center gap-x-2 justify-end">
          <FocusModal.Close asChild>
            <Button size="small" variant="secondary">
              {t("general.cancel")}
            </Button>
          </FocusModal.Close>
          <Button size="small" variant="primary">
            {t("general.save")}
          </Button>
        </div>
      </FocusModal.Header>
      <FocusModal.Body>
        <div className="txt-compact-small relative">
          <Nestable
            items={categories}
            childrenProp="category_children"
            maxDepth={MAX_DEPTH}
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
      {collapseIcon}
      <div className="flex items-center justify-center text-ui-fg-muted w-7 h-7">
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
