import { useAccount } from "../context/account"

export const useUserPermissions = () => {
  const { role, isLoggedIn } = useAccount()

  const isAdmin = role === "admin"
  const isMember = role === "member"
  const isDeveloper = role === "developer"

  // We can add more permissions based things here.
  return {
    isLoggedIn,
    isAdmin,
    isMember,
    isDeveloper,
    productCollection: {
      create: isAdmin,
      update: isAdmin,
    },
  }
}
