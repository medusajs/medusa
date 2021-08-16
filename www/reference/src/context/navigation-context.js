import React, { useReducer } from "react"
import scrollParent from "../utils/scroll-parent"
import types from "./types"

export const defaultNavigationContext = {
  api: "null",
  setApi: () => {},
  currentSection: null,
  updateSection: () => {},
  currentHash: null,
  updateHash: () => {},
  openSections: [],
  openSection: () => {},
  metadata: null,
  updateMetadata: () => {},
  reset: () => {},
}

const NavigationContext = React.createContext(defaultNavigationContext)
export default NavigationContext

const reducer = (state, action) => {
  switch (action.type) {
    case types.SET_API: {
      return {
        ...state,
        api: action.payload,
      }
    }
    case types.UPDATE_HASH:
      return {
        ...state,
        currentSection: action.payload.section,
        currentHash: action.payload.method,
      }
    case types.UPDATE_SECTION:
      return {
        ...state,
        currentSection: action.payload,
        currentHash: null,
      }
    case types.OPEN_SECTION:
      const obj = state.openSections
      obj.push(action.payload)
      return {
        ...state,
        openSections: obj,
      }
    case types.RESET:
      return {
        ...state,
        openSections: [],
        currentSection: null,
        currentHash: null,
      }
    case types.UPDATE_METADATA:
      return {
        ...state,
        metadata: {
          title: action.payload.title,
          description: action.payload.description,
        },
      }
    default:
      return state
  }
}

const scrollNav = id => {
  const nav = document.querySelector("#nav")
  if (nav) {
    const element = nav.querySelector(`#nav-${id}`)
    if (element) {
      scrollParent(nav, element)
    }
  }
}

const scrollToElement = async id => {
  const element = document.querySelector(`#${id}`)
  if (element) {
    element.scrollIntoView({
      block: "start",
      inline: "nearest",
    })
  } else {
    setTimeout(() => {
      scrollToElement(id)
    }, 100)
  }
}

export const NavigationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultNavigationContext)

  const setApi = api => {
    dispatch({ type: types.SET_API, payload: api })
  }

  const updateMetadata = metadata => {
    dispatch({ type: types.UPDATE_METADATA, payload: metadata })
  }

  const updateHash = (section, method) => {
    dispatch({
      type: types.UPDATE_HASH,
      payload: { method: method, section: section },
    })
    window.history.replaceState(
      null,
      "",
      `/api/${state.api}/${section}/${method}`
    )
    scrollNav(method)
  }

  const updateSection = section => {
    dispatch({ type: types.UPDATE_SECTION, payload: section })
    window.history.replaceState(null, "", `/api/${state.api}/${section}`)
    scrollNav(section)
  }

  const openSection = sectionName => {
    dispatch({ type: types.OPEN_SECTION, payload: sectionName })
  }

  const goTo = to => {
    const { section, method } = to

    if (!state.openSections.includes(section)) {
      openSection(section)
    }
    scrollToElement(method || section)
  }

  const reset = () => {
    dispatch({ type: types.RESET })
  }

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        openSection,
        updateSection,
        updateHash,
        setApi,
        goTo,
        reset,
        updateMetadata,
        dispatch,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
