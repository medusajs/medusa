import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "../components/atoms/spinner"
import SEO from "../components/seo"
import { useAccess } from "../providers/access-provider"

const IndexPage = () => {
  const navigate = useNavigate()
  const { getAccess } = useAccess();
  useEffect(() => {
    getAccess().then((startPage)=>{
      navigate(startPage);
    })
  }, [])

  return (
    <div className="bg-grey-5 text-grey-90 flex h-screen w-full items-center justify-center">
      <SEO title="Home" />
      <Spinner variant="secondary" />
    </div>
  )
}

export default IndexPage
