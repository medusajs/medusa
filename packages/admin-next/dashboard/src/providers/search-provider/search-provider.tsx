import { PropsWithChildren, useEffect, useState } from "react"
import { Search } from "../../components/search"
import { SearchContext } from "./search-context"

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useState(false)

  const toggleSearch = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <SearchContext.Provider
      value={{
        open,
        onOpenChange: setOpen,
        toggleSearch,
      }}
    >
      {children}
      <Search />
    </SearchContext.Provider>
  )
}
