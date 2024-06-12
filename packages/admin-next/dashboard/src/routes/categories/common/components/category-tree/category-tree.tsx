import {
  DotsSix,
  FolderIllustration,
  FolderOpenIllustration,
  Swatch,
  TriangleRightMini,
} from "@medusajs/icons"
import { Badge, IconButton, Text, clx } from "@medusajs/ui"
import dropRight from "lodash/dropRight"
import flatMap from "lodash/flatMap"
import get from "lodash/get"
import { ReactNode } from "react"
import Nestable from "react-nestable"

import { useTranslation } from "react-i18next"
import "react-nestable/dist/styles/index.css"
import "./styles.css"
import { CategoryTreeItem } from "./types"

type CategoryTreeProps = {
  value: CategoryTreeItem[]
  onChange: (value: CategoryTreeItem, items: CategoryTreeItem[]) => void
  enableDrag?: boolean | ((item: CategoryTreeItem) => boolean)
  showBadge?: (item: CategoryTreeItem) => boolean
  isLoading?: boolean
}

export const CategoryTree = ({
  value,
  onChange,
  enableDrag = true,
  showBadge,
  isLoading = false,
}: CategoryTreeProps) => {
  const handleDrag = ({
    dragItem,
    items,
    targetPath,
  }: {
    dragItem: CategoryTreeItem
    items: CategoryTreeItem[]
    targetPath: number[]
  }) => {
    let parentId = null
    const [rank] = targetPath.slice(-1)

    if (targetPath.length > 1) {
      const path = dropRight(
        flatMap(targetPath.slice(0, -1), (item) => [item, "category_children"])
      )

      const newParent = get(items, path) as CategoryTreeItem
      parentId = newParent.id
    }

    onChange(
      {
        ...dragItem,
        parent_category_id: parentId,
        rank,
      },
      items
    )

    return {
      ...dragItem,
      parent_category_id: parentId,
      rank,
    }
  }

  const getIsEnabled = (item: CategoryTreeItem) => {
    if (typeof enableDrag === "function") {
      return enableDrag(item)
    }

    return enableDrag
  }

  const getShowBadge = (item: CategoryTreeItem) => {
    if (typeof showBadge === "function") {
      return showBadge(item)
    }

    return false
  }

  if (isLoading) {
    return (
      <div className="txt-compact-small relative flex-1 overflow-y-auto">
        {Array.from({ length: 10 }).map((_, i) => (
          <CategoryLeafPlaceholder key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="txt-compact-small relative flex-1 overflow-y-auto">
      <Nestable
        items={value}
        childrenProp="category_children"
        onChange={({ dragItem, items, targetPath }) =>
          handleDrag({
            dragItem: dragItem as CategoryTreeItem,
            items: items as CategoryTreeItem[],
            targetPath,
          })
        }
        disableDrag={({ item }) => getIsEnabled(item as CategoryTreeItem)}
        renderItem={({ index, item, ...props }) => {
          return (
            <CategoryBranch
              key={index}
              item={item as CategoryTreeItem}
              isEnabled={getIsEnabled(item as CategoryTreeItem)}
              isNew={getShowBadge(item as CategoryTreeItem)}
              {...props}
            />
          )
        }}
        handler={<DragHandle />}
        renderCollapseIcon={({ isCollapsed }) => {
          return <CollapseHandler isCollapsed={isCollapsed} />
        }}
        threshold={10}
      />
    </div>
  )
}

const CollapseHandler = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <div className="flex items-center gap-x-3">
      <IconButton size="small" variant="transparent" type="button">
        <TriangleRightMini
          className={clx({
            "rotate-90 transform transition-transform": !isCollapsed,
          })}
        />
      </IconButton>
      <div
        className="text-ui-fg-muted flex h-7 w-7 items-center justify-center"
        role="presentation"
      >
        {isCollapsed ? <FolderIllustration /> : <FolderOpenIllustration />}
      </div>
    </div>
  )
}

type CategoryBranchProps = {
  item: CategoryTreeItem
  depth: number
  isEnabled: boolean
  isNew?: boolean
  collapseIcon: ReactNode
  handler: ReactNode
}

export const CategoryBranch = ({
  item,
  depth,
  isEnabled,
  isNew = false,
  collapseIcon,
  handler,
}: CategoryBranchProps) => {
  const { t } = useTranslation()

  const isLeaf = !collapseIcon

  const Component = (
    <div
      data-disabled={!isEnabled}
      className={clx(
        "bg-ui-bg-base hover:bg-ui-bg-base-hover transition-fg group group flex h-12 items-center gap-x-3 border-b px-6 py-2.5",
        {
          "bg-ui-bg-subtle hover:bg-ui-bg-subtle": !isEnabled,
        }
      )}
    >
      <div>{handler}</div>
      {Array.from({ length: depth }).map((_, i) => (
        <div key={`offset_${i}`} role="presentation" className="h-7 w-7" />
      ))}
      <div>{collapseIcon}</div>
      {isLeaf && (
        <div role="presentation" className="flex items-center">
          <div className="size-7" />
          <div className="text-ui-fg-muted flex h-7 w-7 items-center justify-center">
            <Swatch />
          </div>
        </div>
      )}

      <div className="flex items-center gap-x-3">
        <Text size="small" leading="compact">
          {item.name}
        </Text>
        <Text>{item.rank}</Text>
        {isNew && (
          <Badge size="2xsmall" color="blue">
            {t("categories.fields.new.label")}
          </Badge>
        )}
      </div>
    </div>
  )

  return Component
}

const DragHandle = () => {
  return (
    <div className="flex h-7 w-7 cursor-grab items-center justify-center active:cursor-grabbing group-data-[disabled=true]:cursor-not-allowed">
      <DotsSix className="text-ui-fg-subtle" />
    </div>
  )
}

const CategoryLeafPlaceholder = () => {
  return (
    <div className="bg-ui-bg-base flex h-12 animate-pulse items-center border-b px-6 py-2.5" />
  )
}
