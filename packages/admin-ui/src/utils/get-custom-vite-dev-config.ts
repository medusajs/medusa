import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { InlineConfig } from "vite"
import { AdminDevConfig } from "../types/dev"
import commonjs from "vite-plugin-commonjs"

export const getCustomViteDevConfig = ({
  backend = "http://localhost:9000",
  port = 7001,
}: AdminDevConfig): InlineConfig => {
  const uiPath = resolve(__dirname, "..", "..", "ui")

  return {
    plugins: [
      react({
        jsxRuntime: "classic",
      }),
      commonjs({
        filter(id) {
          if (id.includes("node_modules/use-sync-external-store")) {
            return true
          }
        },
      }),
    ],
    define: {
      __BASE__: JSON.stringify("/"),
      __MEDUSA_BACKEND_URL__: JSON.stringify(backend),
    },
    root: uiPath,
    server: {
      port,
    },
    // resolve: {
    //     alias: {
    //         "@tanstack/react-query": resolve(require.resolve("@tanstack/react-query"))
    //     }
    // },
    optimizeDeps: {
      force: true,
      include: [
        "react",
        "invariant",
        "react-fast-compare",
        "shallowequal",
        "prop-types",
        "axios",
        "qs",
        "react-dom",
      ],
    },
  }
}
