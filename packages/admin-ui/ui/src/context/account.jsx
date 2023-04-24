import React, { createContext, useReducer, useContext } from "react"
import { adminUserKeys } from "medusa-react"
import Medusa from "../services/api"
import queryClient from "../services/queryClient"

export const defaultAccountContext = {
  isLoggedIn: false,
  id: "",
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "",
}

export const AccountContext = createContext(defaultAccountContext)

const reducer = (state, action) => {
  switch (action.type) {
    case "userAuthenticated": {
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        first_name: action.payload?.first_name,
        last_name: action.payload?.last_name,
        role: action.payload?.role,
      }
    }

    case "updateUser":
      return {
        ...state,
        ...action.payload,
      }
    case "userLoggedOut":
      return defaultAccountContext
    case "userLoggedIn":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        first_name: action.payload?.first_name,
        last_name: action.payload?.last_name,
        role: action.payload?.role,
      }
    default:
      return state
  }
}

export const AccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultAccountContext)

  return (
    <AccountContext.Provider
      value={{
        ...state,
        session: () => {
          return Medusa.auth.session().then(({ data }) => {
            dispatch({ type: "userAuthenticated", payload: data.user })
            return data
          })
        },

        handleUpdateUser: (id, user) => {
          return Medusa.users.update(id, user).then(({ data }) => {
            queryClient.invalidateQueries(adminUserKeys.all)
            dispatch({ type: "updateUser", payload: data.user })
          })
        },

        handleLogout: (details) => {
          return Medusa.auth.deauthenticate(details).then(() => {
            dispatch({ type: "userLoggedOut" })
            return null
          })
        },

        handleLogin: (details) => {
          return Medusa.auth.authenticate(details).then(({ data }) => {
            dispatch({ type: "userLoggedIn", payload: data.user })
            return data
          })
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
