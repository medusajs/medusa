import getBaseUrl from "./get-base-url"

export default function getUrl(area: string, tagName?: string): string {
  return `${getBaseUrl()}/api/${area}#${tagName}`
}
