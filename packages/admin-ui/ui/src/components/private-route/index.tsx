import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../context/account"
import { isBrowser } from "../../utils/is-browser"

const PrivateRoute = ({
  component: Component,
  location,
  ...rest
}: {
  location?: any | undefined
  component: any
  [key: string]: any
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const account = useContext(AccountContext)

  if (account.isLoggedIn) {
    return <Component {...rest} />
  } else if (!loading && isBrowser) {
    account
      .session()
      .then((data) => {
        setLoading(false)
      })
      .catch((err) => {
        navigate("/login")
      })
  }
  return <>Loading...</>
}

export default PrivateRoute
