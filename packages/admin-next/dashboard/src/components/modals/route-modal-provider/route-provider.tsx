import { PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"
import { RouteModalProviderContext } from "./route-modal-context"

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
