import { omit } from "lodash"
import qs from "qs"
import { useMemo, useReducer, useState } from "react"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type OrderDateFilter = null | {
  gt?: string
  lt?: string
}

type OrderFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: OrderFilterState }
  | { type: "reset"; payload: OrderFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: OrderDefaultFilters | null }
  | { type: "setDate"; payload: OrderDateFilter }
  | { type: "setStatus"; payload: null | string[] | string }
  | { type: "setFulfillment"; payload: null | string[] | string }
  | { type: "setPayment"; payload: null | string[] | string }

interface OrderFilterState {
  query?: string | null
  region: {
    open: boolean
    filter: null | string[] | string
  }
  status: {
    open: boolean
    filter: null | string[] | string
  }
  fulfillment: {
    open: boolean
    filter: null | string[] | string
  }
  payment: {
    open: boolean
    filter: null | string[] | string
  }
  date: {
    open: boolean
    filter: OrderDateFilter
  }
  limit: number
  offset: number
  additionalFilters: OrderDefaultFilters | null
}

const allowedFilters = [
  "status",
  "region",
  "fulfillment_status",
  "payment_status",
  "created_at",
  "q",
  "offset",
  "limit",
]

const DefaultTabs = {
  incomplete: {
    fulfillment_status: ["not_fulfilled", "fulfilled"],
    payment_status: ["awaiting"],
  },
  complete: {
    fulfillment_status: ["shipped"],
    payment_status: ["captured"],
  },
}

const formatDateFilter = (filter: OrderDateFilter) => {
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
  state: OrderFilterState,
  action: OrderFilterAction
): OrderFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        region: action.payload.region,
        fulfillment: action.payload.fulfillment,
        payment: action.payload.payment,
        status: action.payload.status,
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

type OrderDefaultFilters = {
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

export const useOrderFilters = (
  existing?: string,
  defaultFilters: OrderDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(() => parseQueryString(existing, defaultFilters), [
    existing,
    defaultFilters,
  ])

  const initialTabs = useMemo(() => {
    const storageString = localStorage.getItem("orders::filters")
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

  const setDateFilter = (filter: OrderDateFilter | null) => {
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

  const setDefaultFilters = (filters: OrderDefaultFilters | null) => {
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
        region: {
          open: false,
          filter: null,
        },
        payment: {
          open: false,
          filter: null,
        },
        fulfillment: {
          open: false,
          filter: null,
        },
        status: {
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

  const setFilters = (filters: OrderFilterState) => {
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
            value.filter as OrderDateFilter
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

  const getRepresentationObject = (fromObject?: OrderFilterState) => {
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
        label: "Complete",
        value: "complete",
      },
      {
        label: "Incomplete",
        value: "incomplete",
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
        payment: {
          open: false,
          filter: null,
        },
        fulfillment: {
          open: false,
          filter: null,
        },
        status: {
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

  const saveTab = (tabName: string, filters: OrderFilterState) => {
    const repObj = getRepresentationObject({ ...filters })
    const clean = omit(repObj, ["limit", "offset"])
    const repString = qs.stringify(clean, { skipNulls: true })

    const storedString = localStorage.getItem("orders::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      existing[tabName] = repString
      localStorage.setItem("orders::filters", JSON.stringify(existing))
    } else {
      const newFilters = {}
      newFilters[tabName] = repString
      localStorage.setItem("orders::filters", JSON.stringify(newFilters))
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
    const storedString = localStorage.getItem("orders::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      delete existing[tabValue]
      localStorage.setItem("orders::filters", JSON.stringify(existing))
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
    setFulfillmentFilter,
    setPaymentFilter,
    setStatusFilter,
    reset,
  }
}

const filterStateMap = {
  status: "status",
  fulfillment_status: "fulfillment",
  payment_status: "payment",
  created_at: "date",
  region_id: "region",
}

const stateFilterMap = {
  region: "region_id",
  status: "status",
  fulfillment: "fulfillment_status",
  payment: "payment_status",
  date: "created_at",
}

const parseQueryString = (
  queryString?: string,
  additionals: OrderDefaultFilters | null = null
): OrderFilterState => {
  const defaultVal: OrderFilterState = {
    status: {
      open: false,
      filter: null,
    },
    fulfillment: {
      open: false,
      filter: null,
    },
    region: {
      open: false,
      filter: null,
    },
    payment: {
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
          case "fulfillment_status": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.fulfillment = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "region_id": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.region = {
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
