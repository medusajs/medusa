import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useAdminSearch } from "../../hooks/api"
import {
  getSearchEntity,
  getSearchEntityNames,
  hasSearchEntity,
  isSearchRegistryCustomized,
  resolveSearchEntityGroupLabel,
} from "../../lib/search/search-entities"
import { Shortcut, ShortcutType } from "../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../providers/keybind-provider/hooks"
import { DynamicSearchResult, SearchArea } from "./types"

type UseSearchProps = {
  q?: string
  limit: number
  area?: SearchArea
}

export const useSearchResults = ({
  q,
  limit,
  area = "all",
}: UseSearchProps) => {
  const staticResults = useStaticSearchResults(area)
  const { dynamicResults, isFetching } = useDynamicSearchResults(area, limit, q)

  return {
    staticResults,
    dynamicResults,
    isFetching,
  }
}

const useStaticSearchResults = (currentArea: SearchArea) => {
  const globalCommands = useGlobalShortcuts()

  const results = useMemo(() => {
    const groups = new Map<ShortcutType, Shortcut[]>()

    globalCommands.forEach((command) => {
      const group = groups.get(command.type) || []
      group.push(command)
      groups.set(command.type, group)
    })

    let filteredGroups: [ShortcutType, Shortcut[]][]

    switch (currentArea) {
      case "all":
        filteredGroups = Array.from(groups)
        break
      case "navigation":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "pageShortcut" || type === "settingShortcut"
        )
        break
      case "command":
        filteredGroups = Array.from(groups).filter(
          ([type]) => type === "commandShortcut"
        )
        break
      default:
        filteredGroups = []
    }

    return filteredGroups.map(([title, items]) => ({
      title,
      items,
    }))
  }, [globalCommands, currentArea])

  return results
}

const useDynamicSearchResults = (
  currentArea: SearchArea,
  limit: number,
  q?: string
) => {
  const { t } = useTranslation()
  const debouncedSearch = useDebouncedSearch(q, 300)

  const registeredEntities = useMemo(() => getSearchEntityNames(), [])

  const entity = useMemo(() => {
    if (currentArea === "all") {
      // With an untouched registry the server's defaults match the client's,
      // so let `/admin/search` decide what "all" covers (engine-only when the
      // Search Module is enabled). Once an app customizes the registry,
      // enumerate it so only its entities are searched.
      return isSearchRegistryCustomized() && registeredEntities.length
        ? registeredEntities
        : undefined
    }

    if (hasSearchEntity(currentArea)) {
      return [currentArea]
    }

    return undefined
  }, [currentArea, registeredEntities])

  const isDynamicArea =
    hasSearchEntity(currentArea) ||
    // "all" with a registry customized down to nothing has nothing to fetch.
    (currentArea === "all" &&
      (!isSearchRegistryCustomized() || registeredEntities.length > 0))

  const { results, isFetching } = useAdminSearch(
    {
      q: debouncedSearch,
      limit,
      entity,
    },
    {
      enabled: Boolean(debouncedSearch) && isDynamicArea,
    }
  )

  const dynamicResults = useMemo(() => {
    if (!q || !results?.length) {
      return []
    }

    return results
      .map((group) => transformSearchResultGroup(group, limit, t))
      .filter(
        (group): group is DynamicSearchResult =>
          !!group && group.items.length > 0
      )
  }, [q, results, limit, t])

  // Treat the debounce wait as loading too — otherwise `CommandEmpty` flashes
  // "no results" for ~300ms before the request even starts.
  const isWaitingForDebounce = Boolean(q) && q !== debouncedSearch

  return {
    dynamicResults,
    isFetching:
      isDynamicArea &&
      (isWaitingForDebounce || (Boolean(debouncedSearch) && isFetching)),
  }
}

const useDebouncedSearch = (value: string | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function transformSearchResultGroup(
  group: HttpTypes.AdminSearchResultGroup,
  limit: number,
  t: TFunction
): DynamicSearchResult | undefined {
  const transform = getSearchEntity(group.entity)?.transform

  if (!transform || !Array.isArray(group.data)) {
    return undefined
  }

  return {
    title: resolveSearchEntityGroupLabel(group.entity, t),
    area: group.entity,
    hasMore: group.count > limit,
    count: group.count,
    items: group.data.map(transform),
  }
}
