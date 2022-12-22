import React, { useState } from "react"

export const defaultCacheContext = {
  cache: {},
}

export const CacheContext = React.createContext(defaultCacheContext)

export const CacheProvider = ({ children }) => {
  const [cache, set] = useState({})

  const setCache = (key, val) => {
    set({
      ...cache,
      [key]: val,
    })
  }

  return (
    <CacheContext.Provider
      value={{
        cache,
        setCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  )
}
