/**
 * We can't use the `tsc` command to generate types for the project because it
 * will generate types for each file in the project, which isn't needed. We only
 * need a single file that exports the App component.
 */
async function generateTypes() {
  const fs = require("fs")
  const path = require("path")

  const distDir = path.resolve(__dirname, "../dist")
  const filePath = path.join(distDir, "index.d.ts")

  const fileContent = `
import * as react_jsx_runtime from "react/jsx-runtime"

declare const App: () => react_jsx_runtime.JSX.Element

export default App
`

  // Ensure the dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir)
  }

  // Write the content to the index.d.ts file
  fs.writeFileSync(filePath, fileContent.trim(), "utf8")

  console.log(`File created at ${filePath}`)
}

;(async () => {
  try {
    await generateTypes()
  } catch (e) {
    console.error(e)
  }
})()
