import type { UniqueIdentifier } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

import type { FlattenedItem, TreeItem } from "./types"

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform)

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier,
  dragOffset: number,
  indentationWidth: number
) {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function flatten<T extends TreeItem>(
  items: T[],
  parentId: UniqueIdentifier | null = null,
  depth = 0,
  childrenProp: string
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const children = (item[childrenProp] || []) as T[]

    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(children, item.id, depth + 1, childrenProp),
    ]
  }, [])
}

export function flattenTree<T extends TreeItem>(
  items: T[],
  childrenProp: string
): FlattenedItem[] {
  return flatten(items, undefined, undefined, childrenProp)
}

type ItemUpdate = {
  id: UniqueIdentifier
  parentId: UniqueIdentifier | null
  index: number
}

export function buildTree<T extends TreeItem>(
  flattenedItems: FlattenedItem[],
  newIndex: number,
  childrenProp: string
): { items: T[]; update: ItemUpdate } {
  const root = { id: "root", [childrenProp]: [] } as T
  const nodes: Record<string, T> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, [childrenProp]: [] }))

  let update: {
    id: UniqueIdentifier | null
    parentId: UniqueIdentifier | null
    index: number
  } = {
    id: null,
    parentId: null,
    index: 0,
  }

  items.forEach((item, index) => {
    const {
      id,
      index: _index,
      depth: _depth,
      parentId: _parentId,
      ...rest
    } = item
    const children = (item[childrenProp] || []) as T[]

    const parentId = _parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, [childrenProp]: children } as T
    ;(parent[childrenProp] as T[]).push({
      id,
      ...rest,
      [childrenProp]: children,
    } as T)

    /**
     * Get the information for them item that was moved to the `newIndex`.
     */
    if (index === newIndex) {
      const parentChildren = parent[childrenProp] as FlattenedItem[]

      update = {
        id: item.id,
        parentId: parent.id === "root" ? null : parent.id,
        index: parentChildren.length - 1,
      }
    }
  })

  if (!update.id) {
    throw new Error("Could not find item")
  }

  return {
    items: root[childrenProp] as T[],
    update: update as ItemUpdate,
  }
}

export function findItem<T extends TreeItem>(
  items: T[],
  itemId: UniqueIdentifier
) {
  return items.find(({ id }) => id === itemId)
}

export function findItemDeep<T extends TreeItem>(
  items: T[],
  itemId: UniqueIdentifier,
  childrenProp: string
): TreeItem | undefined {
  for (const item of items) {
    const { id } = item
    const children = (item[childrenProp] || []) as T[]

    if (id === itemId) {
      return item
    }

    if (children.length) {
      const child = findItemDeep(children, itemId, childrenProp)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

export function setProperty<TItem extends TreeItem, T extends keyof TItem>(
  items: TItem[],
  id: UniqueIdentifier,
  property: T,
  childrenProp: keyof TItem, // Make childrenProp a key of TItem
  setter: (value: TItem[T]) => TItem[T]
): TItem[] {
  return items.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        [property]: setter(item[property]),
      }
    }

    const children = item[childrenProp] as TItem[] | undefined

    if (children && children.length) {
      return {
        ...item,
        [childrenProp]: setProperty(
          children,
          id,
          property,
          childrenProp,
          setter
        ),
      } as TItem // Explicitly cast to TItem
    }

    return item
  })
}

function countChildren<T extends TreeItem>(
  items: T[],
  count = 0,
  childrenProp: string
): number {
  return items.reduce((acc, item) => {
    const children = (item[childrenProp] || []) as T[]

    if (children.length) {
      return countChildren(children, acc + 1, childrenProp)
    }

    return acc + 1
  }, count)
}

export function getChildCount<T extends TreeItem>(
  items: T[],
  id: UniqueIdentifier,
  childrenProp: string
) {
  const item = findItemDeep(items, id, childrenProp)

  const children = (item?.[childrenProp] || []) as T[]

  return item ? countChildren(children, 0, childrenProp) : 0
}

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[],
  childrenProp: string
) {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      const children = (item[childrenProp] || []) as FlattenedItem[]

      if (children.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}

export function listItemsWithChildren<T extends TreeItem>(
  items: T[],
  childrenProp: string
): T[] {
  return items.map((item) => {
    return {
      ...item,
      [childrenProp]: item[childrenProp]
        ? listItemsWithChildren(item[childrenProp] as TreeItem[], childrenProp)
        : [],
    }
  })
}
