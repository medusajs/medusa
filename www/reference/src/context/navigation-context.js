import React, { useReducer } from "react"

import { checkDisplay } from "../utils/check-display"
import scrollParent from "../utils/scroll-parent"
import types from "./types"

export const defaultNavigationContext = {
  api: "null",
  setApi: () => {},
  currentSection: null,
  currentSectionObj: {
    section_name: "",
    paths: [],
    schema: {}
  },
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
  let obj = []
  switch (action.type) {
    case types.SET_API: {
      return {
        ...state,
        api: action.payload,
      }
    }
    case types.UPDATE_HASH:
      obj.push(action.payload.section)
      return {
        ...state,
        openSections: obj,
        currentSection: action.payload.section,
        currentHash: action.payload.method,
        currentSectionObj: action.payload.sectionObj
      }
    case types.UPDATE_SECTION:
      obj.push(action.payload.id)
      return {
        ...state,
        openSections: obj,
        currentSection: action.payload.id,
        currentHash: null,
        currentSectionObj: action.payload.section
      }
    case types.OPEN_SECTION:
      obj.push(action.payload.id)
      return {
        ...state,
        openSections: obj,
        currentSection: action.payload.id,
        currentSectionObj: action.payload.section
      }
    case types.RESET:
      return {
        ...state,
        openSections: [],
        currentSection: null,
        currentHash: null,
        currentSectionObj: {
          section_name: "",
          paths: [],
          schema: {}
        }
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
    if (checkDisplay(element)) {
      element.scrollIntoView({
        block: "start",
        inline: "nearest",
      })
    } else {
      setTimeout(() => {
        scrollToElement(id)
      }, 100)
    }
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

  const updateHash = (section, method, sectionObj) => {
    dispatch({
      type: types.UPDATE_HASH,
      payload: { method: method, section: section, sectionObj },
    })
    window.history.replaceState(
      null,
      "",
      `/api/${state.api}/${section}/${method}`
    )
    scrollNav(method)
  }

  const updateSection = ({id, section}) => {
    dispatch({ type: types.UPDATE_SECTION, payload: {id, section} })
    window.history.replaceState(null, "", `/api/${state.api}/${id}`)
    scrollNav(id)
  }

  const openSection = ({id, section}) => {
    dispatch({ type: types.OPEN_SECTION, payload: {id, section} })
  }

  const goTo = to => {
    const { section, method, sectionObj } = to

    if (!state.openSections.includes(section)) {
      openSection({id: section, section: sectionObj})
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
