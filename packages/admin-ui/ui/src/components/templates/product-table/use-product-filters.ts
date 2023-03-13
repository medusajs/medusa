import { omit } from "lodash"
import qs from "qs"
import { useMemo, useReducer, useState } from "react"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type ProductDateFilter = null | {
  gt?: string
  lt?: string
}

type ProductFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: ProductFilterState }
  | { type: "reset"; payload: ProductFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: ProductDefaultFilters | null }
  | { type: "setDate"; payload: ProductDateFilter }
  | { type: "setStatus"; payload: null | string[] | string }
  | { type: "setFulfillment"; payload: null | string[] | string }
  | { type: "setPayment"; payload: null | string[] | string }
  | { type: "setLimit"; payload: number }

interface ProductFilterState {
  query?: string | null
  status: {
    open: boolean
    filter: null | string[] | string
  }
  collection: {
    open: boolean
    filter: null | string[] | string
  }
  tags: {
    open: boolean
    filter: null | string[] | string
  }
  date: {
    open: boolean
    filter: ProductDateFilter
  }
  limit: number
  offset: number
  additionalFilters: ProductDefaultFilters | null
}

const allowedFilters = [
  "status",
  "collection_id",
  "payment_status",
  "created_at",
  "q",
  "offset",
  "limit",
]

const DefaultTabs = {
  drafts: {
    status: ["draft"],
  },
  proposed: {
    status: ["proposed"],
  },
}

const formatDateFilter = (filter: ProductDateFilter) => {
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
  state: ProductFilterState,
  action: ProductFilterAction
): ProductFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        status: action.payload.status,
        collection: action.payload.collection,
        tags: action.payload.tags,
        date: action.payload.date,
        query: action?.payload?.query,
      }
    }
    case "setQuery": {
      return {
        ...state,
        offset: 0, // reset offset when query changes
        query: action.payload,
      }
    }
    case "setDate": {
      const newDateFilters = state.date
      return {
        ...state,
        date: newDateFilters,
      }
    }
    case "setLimit": {
      return {
        ...state,
        limit: action.payload,
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

type ProductDefaultFilters = {
  expand?: string
  fields?: string
}

const eqSet = (as: Set<string>, bs: Set<string>) => {
  if (as.size !== bs.size) {
    return false
  }
  for (const a of as) {
    if (!bs.has(a)) {
      return false
    }
  }
  return true
}

export const useProductFilters = (
  existing?: string,
  defaultFilters: ProductDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(
    () => parseQueryString(existing, defaultFilters),
    [existing, defaultFilters]
  )

  const initialTabs = useMemo(() => {
    const storageString = localStorage.getItem("products::filters")
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

  const setDateFilter = (filter: ProductDateFilter | null) => {
    dispatch({ type: "setDate", payload: filter })
  }

  const setFulfillmentFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setFulfillment", payload: filter })
  }

  const setPaymentFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setPayment", payload: filter })
  }

  const setStatusFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setStatus", payload: filter })
  }

  const setDefaultFilters = (filters: ProductDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const setLimit = (limit: number) => {
    dispatch({ type: "setLimit", payload: limit })
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
        status: {
          open: false,
          filter: null,
        },
        collection: {
          open: false,
          filter: null,
        },
        tags: {
          open: false,
          filter: null,
        },
        date: {
          open: false,
          filter: null,
        },
        query: null,
      },
    })
  }

  const setFilters = (filters: ProductFilterState) => {
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
          toQuery[stateFilterMap[key]] = formatDateFilter(
            value.filter as ProductDateFilter
          )
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

  const getRepresentationObject = (fromObject?: ProductFilterState) => {
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
              eqSet(new Set(clean[filter]), new Set(value))
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
    return [
      {
        label: "Unpublished",
        value: "drafts",
      },
      ...tabs,
    ]
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
        date: {
          open: false,
          filter: null,
        },
        status: {
          open: false,
          filter: null,
        },
        tags: {
          open: false,
          filter: null,
        },
        collection: {
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

  const saveTab = (tabName: string, filters: ProductFilterState) => {
    const repObj = getRepresentationObject({ ...filters })
    const clean = omit(repObj, ["limit", "offset"])
    const repString = qs.stringify(clean, { skipNulls: true })

    const storedString = localStorage.getItem("products::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      existing[tabName] = repString
      localStorage.setItem("products::filters", JSON.stringify(existing))
    } else {
      const newFilters = {}
      newFilters[tabName] = repString
      localStorage.setItem("products::filters", JSON.stringify(newFilters))
    }

    setTabs((prev) => {
      const duplicate = prev.findIndex(
        (prev) => prev.label?.toLowerCase() === tabName.toLowerCase()
      )
      if (duplicate !== -1) {
        prev.splice(duplicate, 1)
      }
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
    const storedString = localStorage.getItem("products::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      delete existing[tabValue]
      localStorage.setItem("products::filters", JSON.stringify(existing))
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
    setDateFilter,
    setLimit,
    setFulfillmentFilter,
    setPaymentFilter,
    setStatusFilter,
    reset,
  }
}

const filterStateMap = {
  status: "status",
  collection_id: "collection",
  tags: "tags",
  created_at: "date",
}

const stateFilterMap = {
  status: "status",
  collection: "collection_id",
  tags: "tags",
  date: "created_at",
}

const parseQueryString = (
  queryString?: string,
  additionals: ProductDefaultFilters | null = null
): ProductFilterState => {
  const defaultVal: ProductFilterState = {
    status: {
      open: false,
      filter: null,
    },
    collection: {
      open: false,
      filter: null,
    },
    tags: {
      open: false,
      filter: null,
    },
    date: {
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
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.status = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "collection_id": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.collection = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "payment_status": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.payment = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "created_at": {
            defaultVal.date = {
              open: true,
              filter: value,
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
