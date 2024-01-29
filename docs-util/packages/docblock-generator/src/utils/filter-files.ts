import { minimatch } from "minimatch"

export default function (files: string[]): string[] {
  return files.filter((file) =>
    minimatch(
      file,
      "**/packages/@(medusa|types|medusa-js|medusa-react)/src/**/*.@(ts|tsx|js|jsx)",
      {
        matchBase: true,
      }
    )
  )
}
