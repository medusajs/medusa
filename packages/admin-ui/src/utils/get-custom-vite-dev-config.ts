import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { InlineConfig } from "vite"
import { AdminDevConfig } from "../types/dev"

export const getCustomViteDevConfig = ({
  backend = "http://localhost:9000",
  port = 7001,
}: AdminDevConfig): InlineConfig => {
  const uiPath = resolve(__dirname, "..", "..", "ui")

  return {
    plugins: [react()],
    define: {
      __BASE__: JSON.stringify("/"),
      __MEDUSA_BACKEND_URL__: JSON.stringify(backend),
    },
    root: uiPath,
    resolve: {
      alias: {
        "@tanstack/react-query": resolve(
          require.resolve("@tanstack/react-query")
        ),
        "react-dom": resolve(require.resolve("react-dom")),
        react: resolve(require.resolve("react")),
      },
    },
    server: {
      port,
    },
  }
}
