import { createRoot } from "react-dom/client"
import App from "./app"

export async function render(mountNode: HTMLElement | null) {
  if (!mountNode) {
    throw new Error("Mount node not found")
  }

  createRoot(mountNode).render(<App />)

  if (import.meta.hot) {
    import.meta.hot.accept()
  }
}
