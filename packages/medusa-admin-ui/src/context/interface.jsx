import React, { useState } from "react"

export const defaultInterfaceContext = {
  onSearch: query => {},
  setOnSearch: (query) => {},
  onUnmount: () => {},
  display: false,
}

export const InterfaceContext = React.createContext(defaultInterfaceContext)

export const InterfaceProvider = ({ children }) => {
  const [searchHandler, setSearchHandler] = useState(() => () => {})
  const [display, setDisplay] = useState(false)

  const setOnSearch = handler => {
    if (handler) {
      setDisplay(true)
      setSearchHandler(() => {
        return handler
      })
    }
  }

  const unmountAction = () => {
    return () => setDisplay(false)
  }

  return (
    <InterfaceContext.Provider
      value={{
        onSearch: searchHandler,
        setOnSearch,
        onUnmount: unmountAction,
        display,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  )
}
