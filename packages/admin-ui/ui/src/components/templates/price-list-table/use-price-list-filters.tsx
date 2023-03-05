import { omit } from "lodash"
import qs from "qs"
import { useMemo, useReducer, useState } from "react"
import { setsEqual } from "../../../utils/equals-set"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type DateFilter = null | {
  gt?: string
  lt?: string
}

type PriceListFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: PriceListFilterState }
  | { type: "reset"; payload: PriceListFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: PriceListDefaultFilters | null }

interface PriceListFilterState {
  query?: string | null
  status: {
    open: boolean
    filter: null | string[] | string
  }
  type: {
    open: boolean
    filter: null | string[] | string
  }
  customer_groups: {
    open: boolean
    filter: null | string[] | string
  }
  limit: number
  offset: number
  additionalFilters: PriceListDefaultFilters | null
}

const allowedFilters = ["type", "customer_groups", "status", "offset", "limit"]

const DefaultTabs = {}

const formatDateFilter = (filter: DateFilter) => {
  if (filter === null) {
    return filter
  }

  const dateFormatted = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value.includes("|")) {
      acc[key] = relativeDateFormatToTimestamp(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  return dateFormatted
}

const reducer = (
  state: PriceListFilterState,
  action: PriceListFilterAction
): PriceListFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        query: action?.payload?.query,
        status: action.payload.status,
        type: action.payload.type,
        customer_groups: action.payload.customer_groups,
      }
    }
    case "setQuery": {
      return {
        ...state,
        offset: 0, // reset offset when query changes
        query: action.payload,
      }
    }
    case "setOffset": {
      return {
        ...state,
        offset: action.payload,
      }
    }
    case "reset": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

type PriceListDefaultFilters = {
  expand?: string
  fields?: string
}

export const usePriceListFilters = (
  existing?: string,
  defaultFilters: PriceListDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(() => parseQueryString(existing, defaultFilters), [
    existing,
    defaultFilters,
  ])

  const initialTabs = useMemo(() => {
    const storageString = localStorage.getItem("priceLists::filters")
    if (storageString) {
      const savedTabs = JSON.parse(storageString)

      if (savedTabs) {
        return Object.entries(savedTabs).map(([key, value]) => {
          return {
            label: key,
            value: key,
            removable: true,
            representationString: value,
          }
        })
      }
    }

    return []
  }, [])

  const [state, dispatch] = useReducer(reducer, initial)
  const [tabs, setTabs] = useState(initialTabs)

  const setDefaultFilters = (filters: PriceListDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
    }
  }

  const reset = () => {
    dispatch({
      type: "setFilters",
      payload: {
        ...state,
        offset: 0,
        type: {
          open: false,
          filter: null,
        },
        status: {
          open: false,
          filter: null,
        },
        customer_groups: {
          open: false,
          filter: null,
        },
        query: null,
      },
    })
  }

  const setFilters = (filters: PriceListFilterState) => {
    dispatch({ type: "setFilters", payload: filters })
  }

  const setQuery = (queryString: string | null) => {
    dispatch({ type: "setQuery", payload: queryString })
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }
    for (const [key, value] of Object.entries(state)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        if (key === "date") {
          toQuery[stateFilterMap[key]] = formatDateFilter(value.filter)
        } else {
          toQuery[stateFilterMap[key]] = value.filter
        }
      }
    }

    return toQuery
  }

  const getQueryString = () => {
    const obj = getQueryObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const getRepresentationObject = (fromObject?: PriceListFilterState) => {
    const objToUse = fromObject ?? state

    const toQuery: any = {}
    for (const [key, value] of Object.entries(objToUse)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        toQuery[stateFilterMap[key]] = value.filter
      }
    }

    return toQuery
  }

  const getRepresentationString = () => {
    const obj = getRepresentationObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const queryObject = useMemo(() => getQueryObject(), [state])
  const representationObject = useMemo(() => getRepresentationObject(), [state])
  const representationString = useMemo(() => getRepresentationString(), [state])

  const activeFilterTab = useMemo(() => {
    const clean = omit(representationObject, ["limit", "offset"])
    const stringified = qs.stringify(clean)

    const existsInSaved = tabs.find(
      (el) => el.representationString === stringified
    )
    if (existsInSaved) {
      return existsInSaved.value
    }

    for (const [tab, conditions] of Object.entries(DefaultTabs)) {
      let match = true

      if (Object.keys(clean).length !== Object.keys(conditions).length) {
        continue
      }

      for (const [filter, value] of Object.entries(conditions)) {
        if (filter in clean) {
          if (Array.isArray(value)) {
            match =
              Array.isArray(clean[filter]) &&
              setsEqual(new Set(clean[filter]), new Set(value))
          } else {
            match = clean[filter] === value
          }
        } else {
          match = false
        }

        if (!match) {
          break
        }
      }

      if (match) {
        return tab
      }
    }

    return null
  }, [representationObject, tabs])

  const availableTabs = useMemo(() => {
    return [...tabs]
  }, [tabs])

  const setTab = (tabName: string) => {
    let tabToUse: object | null = null
    if (tabName in DefaultTabs) {
      tabToUse = DefaultTabs[tabName]
    } else {
      const tabFound = tabs.find((t) => t.value === tabName)
      if (tabFound) {
        tabToUse = qs.parse(tabFound.representationString)
      }
    }

    if (tabToUse) {
      const toSubmit = {
        ...state,
        type: {
          open: false,
          filter: null,
        },
        status: {
          open: false,
          filter: null,
        },
        customer_groups: {
          open: false,
          filter: null,
        },
      }

      for (const [filter, val] of Object.entries(tabToUse)) {
        toSubmit[filterStateMap[filter]] = {
          open: true,
          filter: val,
        }
      }
      dispatch({ type: "setFilters", payload: toSubmit })
    }
  }

  const saveTab = (tabName: string, filters: PriceListFilterState) => {
    const repObj = getRepresentationObject({ ...filters })
    const clean = omit(repObj, ["limit", "offset"])
    const repString = qs.stringify(clean, { skipNulls: true })

    const storedString = localStorage.getItem("priceLists::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      existing[tabName] = repString
      localStorage.setItem("priceLists::filters", JSON.stringify(existing))
    } else {
      const newFilters = {}
      newFilters[tabName] = repString
      localStorage.setItem("priceLists::filters", JSON.stringify(newFilters))
    }

    setTabs((prev) => {
      return [
        ...prev,
        {
          label: tabName,
          value: tabName,
          representationString: repString,
          removable: true,
        },
      ]
    })

    dispatch({ type: "setFilters", payload: filters })
  }

  const removeTab = (tabValue: string) => {
    const storedString = localStorage.getItem("priceLists::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      delete existing[tabValue]
      localStorage.setItem("priceLists::filters", JSON.stringify(existing))
    }

    setTabs((prev) => {
      const newTabs = prev.filter((p) => p.value !== tabValue)
      return newTabs
    })
  }

  return {
    ...state,
    filters: {
      ...state,
    },
    removeTab,
    saveTab,
    setTab,
    availableTabs,
    activeFilterTab,
    representationObject,
    representationString,
    queryObject,
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
    reset,
  }
}

const filterStateMap = {
  status: "status",
  type: "type",
  customer_groups: "customer_groups",
}

const stateFilterMap = {
  status: "status",
  type: "type",
  customer_groups: "customer_groups",
}

const parseQueryString = (
  queryString?: string,
  additionals: PriceListDefaultFilters | null = null
): PriceListFilterState => {
  const defaultVal: PriceListFilterState = {
    type: {
      open: false,
      filter: null,
    },
    status: {
      open: false,
      filter: null,
    },
    customer_groups: {
      open: false,
      filter: null,
    },
    offset: 0,
    limit: 15,
    additionalFilters: additionals,
  }

  if (queryString) {
    const filters = qs.parse(queryString)
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFilters.includes(key)) {
        switch (key) {
          case "offset": {
            if (typeof value === "string") {
              defaultVal.offset = parseInt(value)
            }
            break
          }
          case "limit": {
            if (typeof value === "string") {
              defaultVal.limit = parseInt(value)
            }
            break
          }
          case "q": {
            if (typeof value === "string") {
              defaultVal.query = value
            }
            break
          }
          case "status": {
            if (typeof value === "string") {
              defaultVal.status = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "type": {
            if (typeof value === "string") {
              defaultVal.status = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "customer_groups": {
            if (Array.isArray(value)) {
              defaultVal.customer_groups = {
                open: true,
                filter: value,
              }
            }
            break
          }
          default: {
            break
          }
        }
      }
    }
  }

  return defaultVal
}
