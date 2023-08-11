import qs from "qs"
import { useMemo, useReducer } from "react"
import set from "lodash/set"

/* ********************************************* */
/* ******************* TYPES ******************* */
/* ********************************************* */

interface AdditionalFilters {
  expand?: string
  fields?: string
}

interface FilterState {
  q?: string
  limit: number
  offset: number
  additionalFilters: AdditionalFilters | null
}

enum Direction {
  Up = 1,
  Down = -1,
}

enum FilterActionType {
  SET_QUERY = "setQuery",
  SET_FILTERS = "setFilters",
  SET_OFFSET = "setOffset",
  SET_DEFAULTS = "setDefaults",
}

type FilterAction =
  | { type: FilterActionType.SET_QUERY; payload: string | undefined }
  | { type: FilterActionType.SET_FILTERS; payload: any; path: string }
  | { type: FilterActionType.SET_OFFSET; payload: number }
  | {
      type: FilterActionType.SET_DEFAULTS
      payload: AdditionalFilters | null
    }

const DEFAULT_ALLOWED_PARAMS = ["q", "offset", "limit"]
const ADMIN_DEFAULT_PARAMS: Partial<FilterState> = {
  limit: 15,
  offset: 0,
}

type QueryObject = Partial<Pick<FilterState, "q">> &
  Pick<FilterState, "limit" | "offset"> &
  Record<string, string>

/* *********************************************** */
/* ******************* HELPERS ******************* */
/* *********************************************** */

/*
 * Transform and merge state values with provided `toQuery` object and
 * return an object containing params.
 */
function buildQueryObject(state: FilterState, toQuery: QueryObject) {
  toQuery = toQuery || {}
  for (const [key, value] of Object.entries(state)) {
    if (key === "q") {
      if (typeof value === "string") {
        if (value) {
          toQuery["q"] = value
        } else {
          delete toQuery["q"]
        }
      }
    } else if (key === "offset" || key === "limit") {
      toQuery[key] = value
    }
  }

  return toQuery
}

/*
 * Get params from state (transformed) without additional params included.
 */
function getRepresentationObject(state: FilterState) {
  return buildQueryObject(state)
}

/*
 * Get transformed params from state along with additional params.
 */
function getQueryObject(state: FilterState) {
  return buildQueryObject(state, { ...state.additionalFilters })
}

/*
 * Transform query string into object representation.
 */
function parseQueryString<T>(
  queryString: string,
  defaults: Partial<FilterState>
): FilterState {
  const representation = {
    ...ADMIN_DEFAULT_PARAMS,
    ...defaults,
  } as FilterState

  if (!queryString) {
    return representation
  }

  const filters = qs.parse(queryString)

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value !== "string") {
      continue
    }

    if (DEFAULT_ALLOWED_PARAMS.includes(key)) {
      switch (key) {
        case "offset":
        case "limit":
          representation[key] = parseInt(value)
          break
        case "q":
          representation.q = value
          break
      }
    }
  }

  return representation
}

/** ********************************************************/
/** ****************** USE FILTERS HOOK ********************/
/** ********************************************************/

/**
 * State reducer for the filters hook.
 */
function reducer(state: FilterState, action: FilterAction): FilterState {
  if (action.type === FilterActionType.SET_FILTERS) {
    const nextState = { ...state }
    // TODO: merge and change refs along the `action.path`
    set(nextState, action.path, action.payload)

    return nextState
  }

  if (action.type === FilterActionType.SET_QUERY) {
    // if the query term has changed reset offset to 0 also
    return { ...state, q: action.payload, offset: 0 }
  }

  if (action.type === FilterActionType.SET_OFFSET) {
    return { ...state, offset: action.payload }
  }

  return state
}

/*
 * Hook returns parsed search params.
 */
const useQueryFilters = (defaultFilters: Partial<FilterState>) => {
  const searchString = location.search.substring(1)

  const [state, dispatch] = useReducer(
    reducer,
    parseQueryString(searchString, defaultFilters)
  )

  /* ********* API METHODS ********* */

  const setDefaultFilters = (filters: AdditionalFilters | null) => {
    dispatch({ type: FilterActionType.SET_DEFAULTS, payload: filters })
  }

  const paginate = (direction: Direction) => {
    if (direction === Direction.Up) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: FilterActionType.SET_OFFSET, payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: FilterActionType.SET_OFFSET, payload: nextOffset })
    }
  }

  const setFilters = (path: string, value: any) =>
    dispatch({ type: FilterActionType.SET_FILTERS, path, payload: value })

  const setQuery = (queryString: string | undefined) =>
    dispatch({ type: FilterActionType.SET_QUERY, payload: queryString })

  const getQueryString = () =>
    qs.stringify(getQueryObject(state), { skipNulls: true })

  const getRepresentationString = () => {
    const obj = getRepresentationObject(state)
    return qs.stringify(obj, { skipNulls: true })
  }

  /* ********* VALUES ********* */

  const queryObject = useMemo(() => getQueryObject(state), [state])
  const representationObject = useMemo(
    () => getRepresentationObject(state),
    [state]
  )
  const representationString = useMemo(() => getRepresentationString(), [state])

  return {
    ...state,
    filters: {
      ...state,
    },
    representationObject,
    representationString,
    queryObject,
    // API
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
  } as const
}

export default useQueryFilters
