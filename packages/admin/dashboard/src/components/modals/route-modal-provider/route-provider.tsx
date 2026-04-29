import { PropsWithChildren, useCallback, useMemo, useState } from "react"
import { Path, useLocation, useNavigate } from "react-router-dom"
import { RouteModalProviderContext } from "./route-modal-context"

type RouteModalProviderProps = PropsWithChildren<{
  prev: string | Partial<Path> | number
}>

export const RouteModalProvider = ({
  prev,
  children,
}: RouteModalProviderProps) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [closeOnEscape, setCloseOnEscape] = useState(true)

  const handleSuccess = useCallback(
    (path?: string) => {
      const to = path || prev
      if (typeof to === "number") {
        // Replace current location with success state, then navigate back
        navigate(location.pathname + location.search, {
          replace: true,
          state: { ...location.state, isSubmitSuccessful: true },
        })
        setTimeout(() => {
          navigate(to)
        }, 0)
      } else {
        navigate(to, { replace: true, state: { isSubmitSuccessful: true } })
      }
    },
    [navigate, prev, location]
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
