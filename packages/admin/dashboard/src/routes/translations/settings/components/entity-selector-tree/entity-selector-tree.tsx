import { TriangleRightMini } from "@medusajs/icons"
import { Checkbox, clx, Divider, Text } from "@medusajs/ui"
import React, { useImperativeHandle, useMemo, useState, useEffect } from "react"

export type EntityField = {
  id: string
  name: string
  selected?: boolean
}

export type Entity = {
  id: string
  name: string
  fields?: EntityField[]
  selected?: boolean
}

type ViewMode = "full" | "selected"
type SortOrder = "asc" | "desc"

type SelectorRowProps = {
  leftElement?: React.ReactNode
  expandButton?: React.ReactNode
  checked: boolean | "indeterminate"
  onCheckedChange: () => void
  label: string
  className?: string
}

const SelectorRow = ({
  leftElement,
  expandButton,
  checked,
  onCheckedChange,
  label,
  className,
}: SelectorRowProps) => {
  const isSelected = checked !== false

  return (
    <div className={clx("flex items-center gap-x-2 px-2 py-1.5", className)}>
      {leftElement}
      <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
      {expandButton}
      <Text
        size="small"
        weight={isSelected ? "plus" : "regular"}
        className="text-ui-fg-base"
      >
        {label}
      </Text>
    </div>
  )
}

export type EntitySelectorTreeRef = {
  selectAllToggle: (selected: boolean) => void
  collapseAll: () => void
}

type EntitySelectorTreeProps = {
  entities: Entity[]
  onSelectionChange?: (selectedIds: Set<string>) => void
  searchQuery: string
  viewMode: ViewMode
  sortOrder: SortOrder
}

export const EntitySelectorTree = React.forwardRef<
  EntitySelectorTreeRef,
  EntitySelectorTreeProps
>(({ entities, onSelectionChange, searchQuery, viewMode, sortOrder }, ref) => {
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(
    new Set()
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const ids = new Set<string>()
    entities.forEach((entity) => {
      entity.fields?.forEach((field) => {
        if (field.selected) {
          ids.add(`${entity.id}.${field.id}`)
        }
      })
    })
    setSelectedIds(ids)
  }, [entities])

  const toggleExpand = (entityId: string) => {
    setExpandedEntities((prev) => {
      const next = new Set(prev)
      if (next.has(entityId)) {
        next.delete(entityId)
      } else {
        next.add(entityId)
      }
      return next
    })
  }

  const getEntitySelectionState = (
    entity: Entity
  ): true | false | "indeterminate" => {
    if (!entity.fields?.length) {
      return false
    }

    const selectedFieldsCount = entity.fields.filter((field) =>
      selectedIds.has(`${entity.id}.${field.id}`)
    ).length

    if (selectedFieldsCount === 0) {
      return false
    }
    if (selectedFieldsCount === entity.fields.length) {
      return true
    }
    return "indeterminate"
  }

  const toggleEntitySelection = (entity: Entity) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const state = getEntitySelectionState(entity)
      const isSelected = state === true

      // Toggle all fields for this entity
      entity.fields?.forEach((field) => {
        const fieldKey = `${entity.id}.${field.id}`
        if (isSelected) {
          next.delete(fieldKey)
        } else {
          next.add(fieldKey)
        }
      })

      onSelectionChange?.(next)
      return next
    })
  }

  const toggleFieldSelection = (entityId: string, fieldId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const fieldKey = `${entityId}.${fieldId}`

      if (next.has(fieldKey)) {
        next.delete(fieldKey)
      } else {
        next.add(fieldKey)
      }

      onSelectionChange?.(next)
      return next
    })
  }

  const selectAllToggle = (selected: boolean) => {
    if (selected) {
      const allIds = new Set<string>()
      entities.forEach((entity) => {
        entity.fields?.forEach((field) => {
          allIds.add(`${entity.id}.${field.id}`)
        })
      })
      setSelectedIds(allIds)
      onSelectionChange?.(allIds)
    } else {
      setSelectedIds(new Set())
      onSelectionChange?.(new Set())
    }
  }

  const collapseAll = () => setExpandedEntities(new Set())

  useImperativeHandle(ref, () => ({
    selectAllToggle,
    collapseAll,
  }))

  const filteredAndSortedEntities = useMemo(() => {
    let filtered = entities

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = entities.filter((entity) => {
        const matchesEntity = entity.name.toLowerCase().includes(query)
        const matchesFields = entity.fields?.some((field) =>
          field.name.toLowerCase().includes(query)
        )
        return matchesEntity || matchesFields
      })
    }

    if (viewMode === "selected") {
      filtered = filtered.filter((entity) => {
        const state = getEntitySelectionState(entity)
        if (state === false) {
          return false
        }
        return true
      })
    }

    const sorted = [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name)
      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [entities, searchQuery, viewMode, sortOrder, selectedIds])

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedEntities.length === 0 ? (
          <div className="text-ui-fg-subtle flex items-center justify-center py-12 text-sm">
            No entities matching filters
          </div>
        ) : (
          <div>
            {filteredAndSortedEntities.map((entity) => {
              const isExpanded = expandedEntities.has(entity.id)
              const hasFields = entity.fields && entity.fields.length > 0
              const selectionState = getEntitySelectionState(entity)

              return (
                <div key={entity.id}>
                  <SelectorRow
                    checked={selectionState}
                    onCheckedChange={() => toggleEntitySelection(entity)}
                    label={entity.name}
                    className="hover:bg-ui-bg-component-hover"
                    expandButton={
                      hasFields ? (
                        <button
                          type="button"
                          onClick={() => toggleExpand(entity.id)}
                          className="flex h-5 w-5 items-center justify-center"
                        >
                          <TriangleRightMini
                            className={clx(
                              "text-ui-fg-muted transition-transform",
                              isExpanded && "rotate-90"
                            )}
                          />
                        </button>
                      ) : null
                    }
                  />

                  {hasFields && isExpanded && (
                    <div className="relative">
                      <Divider
                        orientation="vertical"
                        className="absolute bottom-0 left-[2.87rem] top-0 z-10"
                      />
                      {entity.fields!.map((field) => {
                        const fieldKey = `${entity.id}.${field.id}`
                        const isFieldSelected = selectedIds.has(fieldKey)

                        return (
                          <SelectorRow
                            key={field.id}
                            className="pl-3"
                            leftElement={<div className="w-11" />}
                            checked={isFieldSelected}
                            onCheckedChange={() => {
                              toggleFieldSelection(entity.id, field.id)
                            }}
                            label={field.name}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
})

EntitySelectorTree.displayName = "EntitySelectorTree"
