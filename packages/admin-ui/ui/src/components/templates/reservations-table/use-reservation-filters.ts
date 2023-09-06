import {
  DateComparisonOperator,
  NumericalComparisonOperator,
  StringComparisonOperator,
} from "@medusajs/types"
import { useMemo, useReducer } from "react"

import qs from "qs"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type ReservationDateFilter = null | {
  gt?: string
  lt?: string
}

type reservationFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: ReservationFilterState }
  | { type: "reset"; payload: ReservationFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: ReservationDefaultFilters | null }
  | { type: "setLocation"; payload: string }
  | { type: "setLimit"; payload: number }

interface ReservationFilterState {
  query?: string | null
  limit: number
  offset: number
  location: string
  additionalFilters: ReservationAdditionalFilters
}

type ReservationAdditionalFilters = {
  quantity?: NumericalComparisonOperator
  inventory_item_id?: string[]
  created_at?: DateComparisonOperator
  created_by?: string[]
  location_id?: string
  description?: string | StringComparisonOperator
}

type ReservationDefaultFilters = {
  expand?: string
  fields?: string
  location_id?: string
}

const allowedFilters = [
  "description",
  "offset",
  "limit",
  "location_id",
  "inventory_item_id",
  "quantity",
  "created_at",
  "created_by",
]

const stateFilterMap = {
  location: "location_id",
  inventory_item: "inventory_item_id",
  created_at: "created_at",
  date: "created_at",
  created_by: "created_by",
  description: "description",
  query: "q",
  offset: "offset",
  limit: "limit",
}

const formatDateFilter = (filter: ReservationDateFilter) => {
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
  state: ReservationFilterState,
  action: reservationFilterAction
): ReservationFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        ...action.payload,
      }
    }
    case "setQuery": {
      return {
        ...state,
        query: action.payload,
      }
    }
    case "setDefaults": {
      return {
        ...state,
        additionalFilters: {},
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
    case "setLocation": {
      return {
        ...state,
        location: action.payload,
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

export const useReservationFilters = (
  existing?: string,
  defaultFilters: ReservationDefaultFilters = {}
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(
    () => parseQueryString(existing, defaultFilters),
    [existing, defaultFilters]
  )

  const [state, dispatch] = useReducer(reducer, initial)

  const setDefaultFilters = (filters: ReservationDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const setLocationFilter = (loc: string) => {
    dispatch({ type: "setLocation", payload: loc })
    dispatch({ type: "setOffset", payload: 0 })
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
        query: null,
      },
    })
  }

  const setFilters = (filters: ReservationFilterState) => {
    dispatch({ type: "setFilters", payload: filters })
  }

  const setQuery = (queryString: string | null) => {
    dispatch({ type: "setQuery", payload: queryString })
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }

    if (typeof toQuery.description?.["equals"] === "string") {
      toQuery.description = toQuery.description["equals"]
    }

    for (const [key, value] of Object.entries(state)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value?.open) {
        if (key === "date") {
          toQuery[stateFilterMap[key]] = formatDateFilter(
            value.filter as ReservationDateFilter
          )
        } else {
          toQuery[stateFilterMap[key]] = value.filter
        }
      } else if (key === "location") {
        if (value) {
          toQuery[stateFilterMap[key]] = value
        } else {
          delete toQuery[stateFilterMap[key]]
        }
      }
    }

    toQuery["expand"] = "line_item,inventory_item"

    return toQuery
  }

  const getRepresentationObject = (fromObject?: ReservationFilterState) => {
    const objToUse = fromObject ?? state

    const { additionalFilters, ...filters } = objToUse
    const entryObje = { ...additionalFilters, ...filters }

    const toQuery: any = {}
    for (const [key, value] of Object.entries(entryObje)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (value) {
        toQuery[stateFilterMap[key] || key] = value
      }
    }

    return toQuery
  }

  const queryObject = useMemo(() => getQueryObject(), [state])
  const representationObject = useMemo(() => getRepresentationObject(), [state])

  return {
    ...state,
    filters: {
      ...state,
    },
    representationObject,
    queryObject,
    paginate,
    setQuery,
    setFilters,
    setDefaultFilters,
    setLocationFilter,
    reset,
  }
}

const parseQueryString = (
  queryString?: string,
  additionals: ReservationAdditionalFilters = {}
): ReservationFilterState => {
  const defaultVal: ReservationFilterState = {
    location: additionals?.location_id ?? "",
    offset: 0,
    limit: 15,
    additionalFilters: additionals,
  }

  if (queryString) {
    const filters = qs.parse(queryString)
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFilters.includes(key) && !!value) {
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
          case "location_id": {
            if (typeof value === "string") {
              defaultVal.location = value
            }
            break
          }
          case "description": {
            defaultVal.additionalFilters.description = value as string
            break
          }
          case "quantity": {
            defaultVal.additionalFilters.quantity =
              value as NumericalComparisonOperator
            break
          }
          case "inventory_item_id":
          case "created_by": {
            defaultVal.additionalFilters[key] = (
              Array.isArray(value) ? value : [value]
            ) as string[]
            break
          }
          case "created_at": {
            defaultVal.additionalFilters.created_at =
              value as DateComparisonOperator
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
