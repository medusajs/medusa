import { config } from "../config"

export default function getUrl(area: string, tagName?: string): string {
  return `${config.baseUrl}${process.env.NEXT_PUBLIC_BASE_PATH}/${area}#${tagName}`
}
