export const DOCS_ORIGIN = "https://docs.medusajs.com"

const BRANCH = process.env.PREVIEW_BRANCH
const HOST_SUFFIX = "medusa-sradevski.workers.dev"

const preview = (app: string) => {
  return BRANCH
    ? `https://${BRANCH}-medusa-docs-${app}.${HOST_SUFFIX}`
    : DOCS_ORIGIN
}

// The book preview proxies other apps' paths to production, so each prefix is
// routed to its own branch preview instead.
export const ROUTES: [prefix: string, origin: string][] = [
  ["/resources", preview("resources")],
  ["/api", preview("api-reference")],
  ["/ui", preview("ui")],
  ["/user-guide", preview("user-guide")],
  ["/cloud", preview("cloud")],
  ["", preview("book")],
]

export const PREVIEW_HOSTS = BRANCH ? ROUTES.map(([, origin]) => origin) : []

export const resolveOrigin = (pathname: string) =>
  ROUTES.find(
    ([prefix]) =>
      prefix === "" || pathname === prefix || pathname.startsWith(`${prefix}/`)
  )![1]

export const toPreviewUrl = (input: string) => {
  const url = new URL(input, DOCS_ORIGIN)
  if (url.origin !== DOCS_ORIGIN && !PREVIEW_HOSTS.includes(url.origin)) {
    return null
  }
  return `${resolveOrigin(url.pathname)}${url.pathname}${url.search}`
}

export const replacePreviewHosts = (text: string, origin: string) =>
  PREVIEW_HOSTS.reduce((acc, host) => acc.replaceAll(host, origin), text)
