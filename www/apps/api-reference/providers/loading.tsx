import { createContext, useContext, useState } from "react"

type LoadingContextType = {
  loading: boolean
  removeLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | null>(null)

type LoadingProviderProps = {
  children: React.ReactNode
  initialLoading?: boolean
}

const LoadingProvider = ({
  children,
  initialLoading = false,
}: LoadingProviderProps) => {
  const [loading, setLoading] = useState<boolean>(initialLoading)

  const removeLoading = () => setLoading(false)

  return (
    <LoadingContext.Provider
      value={{
        loading,
        removeLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

export default LoadingProvider

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext)

  if (!context) {
    throw new Error("useLoading must be used inside a LoadingProvider")
  }

  return context
}
