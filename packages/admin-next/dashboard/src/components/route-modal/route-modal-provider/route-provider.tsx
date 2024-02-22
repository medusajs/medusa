import { PropsWithChildren, createContext, useContext } from "react"
import { useNavigate } from "react-router-dom"

type RouteModalProviderContextType = {
  handleSuccess: (path?: string) => void
}

const RouteModalProviderContext =
  createContext<RouteModalProviderContextType | null>(null)

export const useRouteModal = () => {
  const context = useContext(RouteModalProviderContext)

  if (!context) {
    throw new Error("useRouteModal must be used within a RouteModalProvider")
  }

  return context
}

type RouteModalProviderProps = PropsWithChildren<{
  prev: string
}>

export const RouteModalProvider = ({
  prev,
  children,
}: RouteModalProviderProps) => {
  const navigate = useNavigate()

  const handleSuccess = (path?: string) => {
    const to = path || prev
    navigate(to, { replace: true, state: { isSubmitSuccessful: true } })
  }

  return (
    <RouteModalProviderContext.Provider value={{ handleSuccess }}>
      {children}
    </RouteModalProviderContext.Provider>
  )
}
