import qs from "query-string"
import React from "react"
import { useParams } from "react-router-dom"
import Button from "../../components/fundamentals/button"
import Medusa from "../../services/api"

const Oauth = () => {
  const { app_name } = useParams()
  const { code, state } = qs.parse(location.search)
  return (
    <>
      <div>{app_name}</div>
      <Button
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
