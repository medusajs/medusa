import { config } from "../config"
import basePathUrl from "./base-path-url"

/**
 * Build an absolute API reference URL from a page path (without basePath),
 * e.g. `getUrl("/store/carts/get-a-cart")`.
 */
export default function getUrl(path: string): string {
  return `${config.baseUrl}${basePathUrl(path)}`
}
