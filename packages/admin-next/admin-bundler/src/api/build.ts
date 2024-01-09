import { resolve } from "path"
import { build as command } from "vite"

import { createViteConfig } from "./create-vite-config"

type BuildArgs = {
  root?: string
}

export async function build({ root }: BuildArgs) {
  const config = await createViteConfig({
    build: {
      outDir: resolve(process.cwd(), "build"),
    },
  })

  if (!config) {
    return
  }

  await command(config)
}
