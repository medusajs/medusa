import React, { useReducer } from "react"

export const defaultNavigationContext = {
  api: "null",
  setApi: () => {},
  currentSection: null,
  updateSection: () => {},
  currentHash: null,
  updateHash: () => {},
  openSections: [],
  openSection: () => {},
  metaData: null,
  updateMetaData: () => {},
  reset: () => {},
}

const NavigationContext = React.createContext(defaultNavigationContext)
export default NavigationContext

const reducer = (state, action) => {
  switch (action.type) {
    case "setApi": {
      return {
        ...state,
        api: action.payload,
      }
    }
    case "updateHash":
      return {
        ...state,
        currentHash: action.payload,
      }
    case "updateSection":
      return {
        ...state,
        currentSection: action.payload,
        currentHash: null,
      }
    case "openSection":
      const obj = state.openSections
      obj.push(action.payload)
      return {
        ...state,
        openSections: obj,
      }
    case "reset":
      return {
        ...state,
        openSections: [],
        currentSection: null,
        currentHash: null,
      }
    case "updateMetaData":
      return {
        ...state,
        metaData: {
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
      /**
       * FIXME: This value is semi random and is error prone. Most of the
       * time it will result in the current section/method being shown
       * close to the center of the sidebar, but scrolling very fast can result in
       * it having janky movements, going to random sections etc.
       */
      const offset = element.offsetTop - 350
      nav.scroll({
        top: offset > 0 ? offset : 0,
        left: 0,
        behavior: "smooth",
      })
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
    dispatch({ type: "setApi", payload: api })
  }

  const updateMetaData = metadata => {
    dispatch({ type: "updateMetaData", payload: metadata })
  }

  const updateHash = (section, method) => {
    dispatch({ type: "updateHash", payload: method })
    window.history.replaceState(
      null,
      "",
      `/api/${state.api}/${section}/${method}`
    )
    scrollNav(method)
  }

  const updateSection = section => {
    dispatch({ type: "updateSection", payload: section })
    window.history.replaceState(null, "", `/api/${state.api}/${section}`)
    scrollNav(section)
  }

  const openSection = sectionName => {
    dispatch({ type: "openSection", payload: sectionName })
  }

  const goTo = to => {
    const { section, method } = to

    if (!state.openSections.includes(section)) {
      openSection(section)
    }
    scrollToElement(method || section)
  }

  const reset = () => {
    dispatch({ type: "reset" })
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
        updateMetaData,
        dispatch,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
