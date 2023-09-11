import useIsBrowser from "@docusaurus/useIsBrowser"
import React, { createContext, useContext, useEffect, useState } from "react"
import uuid from "react-uuid"

type UserContextType = {
  id: string
  track: (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => void
}

const UserContext = createContext<UserContextType | null>(null)

type UserProviderProps = {
  children?: React.ReactNode
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [id, setId] = useState<string>("")
  const isBrowser = useIsBrowser()

  const initId = () => {
    if (!id.length) {
      if (isBrowser) {
        const storedId = localStorage.getItem("ajs_anonymous_id")
        if (storedId) {
          setId(storedId)
        } else {
          const generatedId = uuid()
          localStorage.setItem("ajs_anonymous_id", generatedId)
          setId(generatedId)
        }
      }
    }
  }

  const track = (
    event: string,
    options?: Record<string, any>,
    callback?: () => void
  ) => {
    if (isBrowser) {
      if (window.analytics) {
        window.analytics.track(
          event,
          {
            ...options,
            uuid: id,
            anonymousId: id,
          },
          callback
        )
      } else if (callback) {
        console.warn(
          "Segment is either not installed or not configured. Simulating success..."
        )
        callback()
      }
    }
  }

  useEffect(() => {
    initId()
  }, [isBrowser])

  return (
    <UserContext.Provider
      value={{
        id,
        track,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }

  return context
}
