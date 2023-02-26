import { useAdminGetSession } from "medusa-react"
import { PropsWithChildren, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/atoms/spinner"

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAdminGetSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return <>{children}</>
}
