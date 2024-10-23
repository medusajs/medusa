"use client"

import { ExpandedDocument, SecuritySchemeObject } from "@/types/openapi"
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react"
import { SidebarItem, SidebarItemSections } from "types"
import getSectionId from "../utils/get-section-id"
import getTagChildSidebarItems from "../utils/get-tag-child-sidebar-items"
import { usePathname, useRouter } from "next/navigation"
import { usePrevious, useSidebar } from "docs-ui"

type BaseSpecsContextType = {
  baseSpecs: ExpandedDocument | undefined
  getSecuritySchema: (securityName: string) => SecuritySchemeObject | null
}

const BaseSpecsContext = createContext<BaseSpecsContextType | null>(null)

type BaseSpecsProviderProps = {
  baseSpecs: ExpandedDocument | undefined
  children?: ReactNode
}

const BaseSpecsProvider = ({ children, baseSpecs }: BaseSpecsProviderProps) => {
  const router = useRouter()
  const { items, activePath, addItems, setActivePath, resetItems } =
    useSidebar()
  const pathname = usePathname()
  const prevPathName = usePrevious(pathname)

  const getSecuritySchema = (
    securityName: string
  ): SecuritySchemeObject | null => {
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

  const itemsToAdd = useMemo(() => {
    if (!baseSpecs) {
      return []
    }

    const itemsToAdd: SidebarItem[] = [
      {
        type: "separator",
      },
    ]

    baseSpecs.tags?.forEach((tag) => {
      const tagPathName = getSectionId([tag.name.toLowerCase()])
      const childItems =
        baseSpecs.expandedTags &&
        Object.hasOwn(baseSpecs.expandedTags, tagPathName)
          ? getTagChildSidebarItems(baseSpecs.expandedTags[tagPathName])
          : []
      itemsToAdd.push({
        type: "category",
        title: tag.name,
        children: childItems,
        loaded: childItems.length > 0,
        showLoadingIfEmpty: true,
        onOpen: () => {
          if (location.hash !== tagPathName) {
            router.push(`#${tagPathName}`, {
              scroll: false,
            })
          }
          if (activePath !== tagPathName) {
            setActivePath(tagPathName)
          }
        },
      })
    })

    return itemsToAdd
  }, [baseSpecs])

  useEffect(() => {
    if (!itemsToAdd.length) {
      return
    }

    addItems(itemsToAdd, {
      section: SidebarItemSections.DEFAULT,
    })
  }, [itemsToAdd])

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
