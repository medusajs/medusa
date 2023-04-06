import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/atoms/spinner"
import SEO from "../components/seo"

const IndexPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate("/a/orders")
  }, [])

  return (
    <div className="bg-grey-5 text-grey-90 flex h-screen w-full items-center justify-center">
      <SEO title="Home" />
      <Spinner variant="secondary" />
    </div>
  )
}

export default IndexPage
