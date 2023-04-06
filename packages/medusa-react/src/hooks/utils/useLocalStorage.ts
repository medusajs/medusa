import * as React from "react"

export const useLocalStorage = (key: string, initialState: string) => {
  const [item, setItem] = React.useState(() => {
    try {
      const item =
        typeof window !== "undefined" && window.localStorage.getItem(key)

      return item || initialState
    } catch (err) {
      return initialState
    }
  })

  const save = (data: string) => {
    setItem(data)

    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, data)
    }
  }

  const remove = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key)
    }
  }

  return [item, save, remove] as const
}
