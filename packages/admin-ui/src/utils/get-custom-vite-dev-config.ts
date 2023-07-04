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
    define: {
      __BASE__: JSON.stringify("/"),
      __MEDUSA_BACKEND_URL__: JSON.stringify(backend),
    },
    plugins: [react()],
    root: uiPath,
    mode: "development",
    server: {
      port,
    },
  }
}
