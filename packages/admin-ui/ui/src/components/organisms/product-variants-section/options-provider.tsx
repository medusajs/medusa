import { Product, ProductOption } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import React, { createContext, useContext, useMemo } from "react"

type OptionsContext = {
  options: ProductOption[] | undefined
  status: "loading" | "success" | "error" | "idle"
  refetch: () => void
}

const OptionsContextType = createContext<OptionsContext | null>(null)

type Props = {
  product: Product
  children?: React.ReactNode
}

const OptionsProvider = ({ product, children }: Props) => {
  const { products, status, refetch } = useAdminProducts({
    id: product.id,
    expand: "options,options.values",
  })

  const options = useMemo(() => {
    if (products && products.length > 0 && status !== "loading") {
      return products[0].options
    } else {
      return undefined
    }
  }, [products, status])

  return (
    <OptionsContextType.Provider value={{ options, status, refetch }}>
      {children}
    </OptionsContextType.Provider>
  )
}

export const useOptionsContext = () => {
  const context = useContext(OptionsContextType)
  if (!context) {
    throw new Error("useOptionsContext must be used within a OptionsProvider")
  }
  return context
}

export default OptionsProvider
