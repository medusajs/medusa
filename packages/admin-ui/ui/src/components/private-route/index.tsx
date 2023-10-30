import { useAdminGetSession } from "medusa-react"
import { ReactNode, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Spinner from "../atoms/spinner"
import { useAccess } from "../../providers/access-provider"
import NotFoundPage from "../../pages/404"

type PrivateRouteProps = {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAdminGetSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login")
    }
  }, [user, isLoading, navigate])

  // Check access

  const {checkAccess} = useAccess();
  const location = useLocation();
  if(!checkAccess(location.pathname))
    return(<NotFoundPage />);
  
  //

  if (user && !isLoading) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner variant="secondary" />
    </div>
  )
}

export default PrivateRoute
