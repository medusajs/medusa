import { createContext } from "react"

type SearchContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
  toggleSearch: () => void
}

export const SearchContext = createContext<SearchContextValue | null>(null)
