import { PropsWithChildren, useCallback, useMemo, useState } from "react"
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

  const [closeOnEscape, setCloseOnEscape] = useState(true)

  const handleSuccess = useCallback(
    (path?: string) => {
      const to = path || prev
      navigate(to, { replace: true, state: { isSubmitSuccessful: true } })
    },
    [navigate, prev]
  )

  const value = useMemo(
    () => ({
      handleSuccess,
      setCloseOnEscape,
      __internal: { closeOnEscape },
    }),
    [handleSuccess, setCloseOnEscape, closeOnEscape]
  )

  return (
    <RouteModalProviderContext.Provider value={value}>
      {children}
    </RouteModalProviderContext.Provider>
  )
}
