import { useContext, useMemo } from "react"
import { AccountContext } from "../context/account"

export const useIsMe = (userId: string | undefined) => {
  const account = useContext(AccountContext)

  const isMe = useMemo(() => {
    return !account.id || !userId ? false : account.id === userId
  }, [account, userId])

  return isMe
}
