import { useAdminGetSession, useAdminLogin } from "medusa-react"
import { PropsWithChildren } from "react"
import { AuthContext } from "./auth-context"

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { mutateAsync: loginMutation } = useAdminLogin({
    retry: false,
  })
  const { user, isLoading } = useAdminGetSession({
    retry: false,
  })

  const login = async (email: string, password: string) => {
    return await loginMutation({ email, password })
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        user: user ?? null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
