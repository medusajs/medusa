import { config } from "../config"

export default function getUrl(area: string, tagName?: string): string {
  return `${config.baseUrl}/api/${area}#${tagName}`
}
