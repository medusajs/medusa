"use client"

import React from "react"
import { OpenAPI } from "types"
import { ReactNode, createContext, useContext, useEffect, useMemo } from "react"
import getTagChildSidebarItems from "../utils/get-tag-child-sidebar-items"
import { useRouter } from "next/navigation"
import { UpdateActionType, useSidebar } from "docs-ui"
import { getSectionId } from "docs-utils"

type BaseSpecsContextType = {
  baseSpecs: OpenAPI.ExpandedDocument | undefined
  getSecuritySchema: (
    securityName: string
  ) => OpenAPI.SecuritySchemeObject | null
}

const BaseSpecsContext = createContext<BaseSpecsContextType | null>(null)

type BaseSpecsProviderProps = {
  baseSpecs: OpenAPI.ExpandedDocument | undefined
  children?: ReactNode
}

const BaseSpecsProvider = ({ children, baseSpecs }: BaseSpecsProviderProps) => {
  const router = useRouter()
  const { activePath, setActivePath, resetItems, shownSidebar, updateItems } =
    useSidebar()

  const getSecuritySchema = (
    securityName: string
  ): OpenAPI.SecuritySchemeObject | null => {
    if (
      baseSpecs?.components?.securitySchemes &&
      Object.prototype.hasOwnProperty.call(
        baseSpecs?.components?.securitySchemes,
        securityName
      )
    ) {
      const schema = baseSpecs?.components?.securitySchemes[securityName]
      if (!("$ref" in schema)) {
        return schema
      }
    }

    return null
  }

  const itemsToUpdate = useMemo(() => {
    if (!baseSpecs) {
      return []
    }

    const itemsToUpdate: UpdateActionType["items"] = []

    baseSpecs.tags?.forEach((tag) => {
      const tagPathName = getSectionId([tag.name.toLowerCase()])
      const childItems =
        baseSpecs.expandedTags &&
        Object.hasOwn(baseSpecs.expandedTags, tagPathName)
          ? getTagChildSidebarItems(baseSpecs.expandedTags[tagPathName])
          : []
      itemsToUpdate.push({
        existingItem: {
          type: "category",
          title: tag.name,
        },
        newItem: {
          children: childItems,
          loaded: childItems.length > 0,
          onOpen: () => {
            const currentHash = location.hash.replace("#", "")
            if (currentHash !== tagPathName) {
              router.push(`#${tagPathName}`, {
                scroll: false,
              })
            }
            if (activePath !== tagPathName) {
              setActivePath(tagPathName)
            }
          },
        },
        options: {
          setChildrenBehavior: "merge",
        },
      })
    })

    return itemsToUpdate
  }, [baseSpecs])

  useEffect(() => {
    if (!itemsToUpdate.length || !shownSidebar) {
      return
    }

    updateItems({
      sidebar_id: shownSidebar.sidebar_id,
      items: itemsToUpdate,
    })
  }, [itemsToUpdate, shownSidebar?.sidebar_id])

  useEffect(() => {
    return () => {
      resetItems()
    }
  }, [])

  return (
    <BaseSpecsContext.Provider
      value={{
        baseSpecs,
        getSecuritySchema,
      }}
    >
      {children}
    </BaseSpecsContext.Provider>
  )
}

export default BaseSpecsProvider

export const useBaseSpecs = (): BaseSpecsContextType => {
  const context = useContext(BaseSpecsContext)

  if (!context) {
    throw new Error("useBaseSpecs must be used inside a BaseSpecsProvider")
  }

  return context
}
