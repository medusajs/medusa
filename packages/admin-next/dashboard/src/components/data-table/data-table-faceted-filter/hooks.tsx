import { useContext } from "react"
import { useSearchParams } from "react-router-dom"
import { DataTableFacetedFilterContext } from "./context"

export const useSelectedParams = ({
  title,
  multiple = false,
}: {
  title: string
  multiple?: boolean
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const add = (value: string) => {
    setSearchParams((prev) => {
      if (multiple) {
        const existingValues = prev.get(title)?.split(",") || []
        if (!existingValues.includes(value)) {
          existingValues.push(value)
          prev.set(title, existingValues.join(","))
        }
      } else {
        prev.set(title, value)
      }
      return prev
    })
  }

  const deleteParam = (value?: string) => {
    if (!value) {
      setSearchParams((prev) => {
        prev.delete(title)
        return prev
      })
      return
    }

    setSearchParams((prev) => {
      if (multiple) {
        const existingValues = prev.get(title)?.split(",") || []
        const index = existingValues.indexOf(value)
        if (index > -1) {
          existingValues.splice(index, 1)
          prev.set(title, existingValues.join(","))
        }
      } else {
        prev.delete(title)
      }
      return prev
    })
  }

  const get = () => {
    return searchParams.get(title)?.split(",").filter(Boolean) || []
  }

  return { add, delete: deleteParam, get }
}

export const useDataTableFacetedFilterContext = () => {
  const ctx = useContext(DataTableFacetedFilterContext)
  if (!ctx) {
    throw new Error(
      "useDataTableFacetedFilterContext must be used within a DataTableFacetedFilter"
    )
  }
  return ctx
}
