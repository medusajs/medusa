import { FC, PropsWithChildren, useEffect } from "react"
import { Toaster } from "react-hot-toast"
import Tracker from "@openreplay/tracker"
import { useAccount } from "../../context/account"

// @see https://vitejs.dev/guide/env-and-mode.html#env-variables
const openReplayToken = import.meta.env.VITE_OPEN_REPLAY_TOKEN

const tracker = openReplayToken
  ? new Tracker({ projectKey: openReplayToken, __DISABLE_SECURE_MODE: true })
  : undefined

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  const { email } = useAccount()

  useEffect(() => {
    tracker?.start()
  }, [])

  useEffect(() => {
    tracker?.setUserID(email)
  }, [email])

  return (
    <>
      <Toaster
        containerStyle={{
          top: 74,
          left: 24,
          bottom: 24,
          right: 24,
        }}
      />
      {children}
    </>
  )
}

export default BaseLayout
