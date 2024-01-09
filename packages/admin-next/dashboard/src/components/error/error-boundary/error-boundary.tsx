import type { AxiosError } from "axios"
import { Navigate, useLocation, useRouteError } from "react-router-dom"

export const ErrorBoundary = () => {
  const error = useRouteError()
  const location = useLocation()

  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return <Navigate to="/404" />
    }

    if (error.response?.status === 401) {
      return <Navigate to="/login" state={{ from: location }} replace />
    }

    // TODO: Catch other server errors
  }

  // TODO: Actual catch-all error page
  return <div>Dang!</div>
}

const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError
}
