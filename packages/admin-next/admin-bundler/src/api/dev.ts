import { createServer } from "vite"
// @ts-ignore
import { createViteConfig } from "./create-vite-config"

type DevArgs = {
  port?: number | undefined
  host?: string | boolean | undefined
}

export async function dev({ port = 5173, host }: DevArgs) {
  const config = await createViteConfig({
    server: {
      port,
      host,
    },
  })

  if (!config) {
    return
  }

  const server = await createServer(config)

  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}
