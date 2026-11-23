import http from "node:http"
import { pathToFileURL } from "node:url"
import { DOCS_ORIGIN, replacePreviewHosts, resolveOrigin } from "./routes.js"

const TEXT_TYPES = /text|json|javascript|xml|markdown|x-component/
const DROPPED_HEADERS = [
  "content-encoding",
  "content-length",
  "transfer-encoding",
]

export const startProxy = async (port: number) => {
  const self = `http://localhost:${port}`
  const rewrite = (text: string) =>
    replacePreviewHosts(text.replaceAll(DOCS_ORIGIN, self), self)

  const server = http.createServer(async (req, res) => {
    try {
      const url = req.url || "/"
      const headers: Record<string, string> = {}
      for (const [key, value] of Object.entries(req.headers)) {
        if (
          typeof value === "string" &&
          key !== "host" &&
          key !== "connection"
        ) {
          headers[key] = value
        }
      }
      headers["accept-encoding"] = "identity"

      const upstream = await fetch(
        `${resolveOrigin(url.split("?")[0])}${url}`,
        {
          method: req.method,
          headers,
          redirect: "manual",
        }
      )

      const outHeaders: Record<string, string> = {}
      upstream.headers.forEach((value, key) => {
        if (!DROPPED_HEADERS.includes(key)) {
          outHeaders[key] = key === "location" ? rewrite(value) : value
        }
      })

      let body = Buffer.from(await upstream.arrayBuffer())
      if (TEXT_TYPES.test(upstream.headers.get("content-type") || "")) {
        body = Buffer.from(rewrite(body.toString("utf8")))
      }

      res.writeHead(upstream.status, outHeaders)
      res.end(body)
    } catch (e) {
      res.writeHead(502, { "content-type": "text/plain" })
      res.end(`proxy error: ${(e as Error).message}`)
    }
  })

  return new Promise<http.Server>((resolve) =>
    server.listen(port, "127.0.0.1", () => resolve(server))
  )
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PROXY_PORT || 4321)
  await startProxy(port)
  process.stdout.write(`Docs proxy on http://localhost:${port}\n`)
}
