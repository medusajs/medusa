import { useParams } from "react-router-dom"
import Button from "../../components/fundamentals/button"
import Medusa from "../../services/api"

const Oauth = () => {
  const { app_name, code, state } = useParams()
  return (
    <>
      <div>{app_name}</div>
      <Button
        variant="primary"
        size="large"
        onClick={() =>
          Medusa.apps.authorize({
            application_name: app_name,
            code,
            state,
          })
        }
      >
        Complete Installation
      </Button>
    </>
  )
}

export default Oauth
