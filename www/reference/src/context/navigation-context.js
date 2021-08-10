import React, { useEffect, useReducer, useState } from "react"
import { globalHistory } from "@reach/router"

export const defaultNavigationContext = {
  api: "store",
  setApi: () => {},
  currentSection: null,
  updateSection: () => {},
  currentHash: null,
  updateHash: () => {},
  openSections: [],
  openSection: () => {},
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
        openSections: [],
      }
    default:
      return state
  }
}

const scrollNav = id => {
  const nav = document.querySelector("#nav")
  if (nav) {
    const element = nav.querySelector(`#nav-${id}`)
    console.log(element)
    if (element) {
      const childOffset = element.offsetTop
      console.log("offset", childOffset)
      const offset = element.offsetTop - 350
      nav.scroll({
        top: offset > 0 ? offset : 0,
        left: 0,
        behavior: "smooth",
      })
    }
  }
}

export const NavigationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultNavigationContext)

  // useEffect(() => {
  //   globalHistory.listen(({ location }) => {
  //     console.log(location.hash.slice(1))
  //     console.log("HASH", location.hash)
  //     updateHash(location.hash.slice(1))
  //   })
  // }, [])

  const setApi = api => {
    dispatch({ type: "setApi", payload: api })
  }

  const updateHash = (section, method) => {
    dispatch({ type: "updateHash", payload: method })
    const newLocation = `/api/${state.api}/${section}/${method}`
    console.log(newLocation)
    window.history.replaceState(null, "", newLocation)
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
    dispatch({ type: "openSection", payload: section })

    if (method) {
      const element = document.querySelector(`#${method}`)
      console.log(element, method)
      if (element) {
        element.scrollIntoView({
          block: "start",
          inline: "nearest",
        })
      }
    } else {
      const element = document.querySelector(`#${section}`)
      console.log(element, section)
      if (element) {
        element.scrollIntoView({
          block: "start",
          inline: "nearest",
        })
      }
    }
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
        dispatch,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
