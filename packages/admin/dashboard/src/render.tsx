import { createRoot } from "react-dom/client"
import { MedusaApp } from "./medusa-app"
import { DashboardExtensionConfig } from "./providers/medusa-app-provider/types"

export async function render(
  mountNode: HTMLElement | null,
  ctx: {
    config: DashboardExtensionConfig
  }
) {
  if (!mountNode) {
    throw new Error("Mount node not found")
  }

  const app = new MedusaApp({ config: ctx.config })

  createRoot(mountNode).render(app.render())
}
