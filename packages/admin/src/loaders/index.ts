import open from "open"
import { loadConfig } from "../utils"

export default async function adminLoader() {
  const { dev, path } = loadConfig()

  console.log(
    "Should open browser?",
    dev?.autoOpen,
    process.env.NODE_ENV === "development"
  )

  if (process.env.NODE_ENV === "development" && dev?.autoOpen) {
    let port = 9000

    if (process.argv.includes("--port") || process.argv.includes("-p")) {
      const portIndex =
        process.argv.indexOf("--port") || process.argv.indexOf("-p")
      port = parseInt(process.argv[portIndex + 1])
    }

    /**
     * Very naive way of opening the browser, which will result in the browser opening a new tab even if a tab is already open with the URL.
     * It is possible to check if a tab is already open with the URL, and if so, focus that tab instead of opening a new one.
     * However, this does not work when executed from a loader, as we open the browser before the admin is actually ready (server has started).
     * When we have a option to only run this code once the server has started, instead of during the loader step, we can revisit this.
     */
    await open(`http://localhost:${port}${path}`)
  }
}
