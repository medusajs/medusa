import { config } from "../config"
import basePathUrl from "./base-path-url"

export default function getUrl(area: string, tagName?: string): string {
  return `${config.baseUrl}${basePathUrl(`/${area}#${tagName}`)}`
}
