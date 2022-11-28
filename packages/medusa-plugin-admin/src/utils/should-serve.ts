import { IS_PROD } from "../constants/is-prod"

export const shouldServe = ({ serve = true, serveInDev = true }) => {
  if (serve) {
    return true
  }

  if (serveInDev && !IS_PROD) {
    return true
  }

  return false
}
