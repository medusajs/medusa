import { useMatch } from "react-router-dom"
import { isBrowser } from "./is-browser"

export const useBasePath = (appendPath?: string): string => {
  const match = useMatch("/vendor/:vendor_id/*") // TODO: Validate this

  return `${match ? match?.pathnameBase : "/admin"}${appendPath || ""}`
}

export const useSwapVendors = () => {
  if (!isBrowser) {
    return () => "/"
  }

  const vendorPathMatch = useMatch("/vendor/:vendor_id/*")

  return (vendorId?: string | null) => {
    if (!isBrowser) {
      return "/"
    }

    const currentPath = window.location.pathname
    const replace = vendorPathMatch ? vendorPathMatch.pathnameBase : `/admin`
    const commonResources = [
      "balance",
      "orders",
      "products",
      "customers",
      "settings",
    ]
    const remainingPath = currentPath.replace(new RegExp(`^(${replace})`), "")

    const newPathPrefix =
      vendorPathMatch && !vendorId ? "/admin" : `/vendor/${vendorId}`

    // Check if the remainingPath is a common resource.
    if (
      commonResources.some((resource) =>
        remainingPath.startsWith(`/${resource}`)
      ) &&
      // The `settings` resource should only be considered common to vendors in this case.
      !(newPathPrefix === "/admin" && remainingPath.startsWith(`/settings`))
    ) {
      // Set the path to the root of the common resource.
      return `${newPathPrefix}/${remainingPath.split("/")[1]}`
    }

    // If the path is not a common resource, redirect to the orders page
    return `${newPathPrefix}`
  }
}
