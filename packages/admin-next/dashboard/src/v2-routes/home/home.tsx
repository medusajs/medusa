import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const Home = () => {
  const navigate = useNavigate()

  // Currently, the home page simply redirects to the settings page
  useEffect(() => {
    navigate("/settings", { replace: true })
  }, [navigate])

  return <div />
}
