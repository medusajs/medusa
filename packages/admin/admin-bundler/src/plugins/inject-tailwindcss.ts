import path from "node:path"
import type { Config } from "tailwindcss"
import type { Plugin } from "vite"

interface InjectTailwindCSSOptions {
  entry: string
  sources?: string[]
  plugins?: string[]
}

export const injectTailwindCSS = (
  options: InjectTailwindCSSOptions
): Plugin => {
  return {
    name: "medusa:inject-tailwindcss",
    config: () => ({
      css: {
        postcss: {
          plugins: [
            require("tailwindcss")({
              config: createTailwindConfig(
                options.entry,
                options.sources,
                options.plugins
              ),
            }),
          ],
        },
      },
    }),
  }
}

function createTailwindConfig(
  entry: string,
  sources: string[] = [],
  plugins: string[] = []
) {
  const root = path.join(entry, "**/*.{js,ts,jsx,tsx}")
  const html = path.join(entry, "index.html")

  let dashboard = ""

  try {
    dashboard = path.join(
      path.dirname(require.resolve("@zjedene-medusa/dashboard")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  let ui: string = ""

  try {
    ui = path.join(
      path.dirname(require.resolve("@zjedene-medusa/ui")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  const sourceExtensions = sources.map((s) =>
    path.join(s, "**/*.{js,ts,jsx,tsx}")
  )
  const pluginExtensions: string[] = []

  for (const plugin of plugins) {
    try {
      const pluginPath = path.join(
        path.dirname(require.resolve(plugin)),
        "**/*.{js,ts,jsx,tsx}"
      )

      pluginExtensions.push(pluginPath)
    } catch (_e) {
      // ignore
    }
  }

  const config: Config = {
    presets: [require("@zjedene-medusa/ui-preset")],
    content: [
      html,
      root,
      dashboard,
      ui,
      ...sourceExtensions,
      ...pluginExtensions,
    ],
    darkMode: "class",
  }

  return config
}
