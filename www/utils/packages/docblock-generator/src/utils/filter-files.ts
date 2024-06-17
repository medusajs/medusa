import { minimatch } from "minimatch"

export default function (files: string[]): string[] {
  return files.filter((file) =>
    minimatch(
      file,
      "**/packages/@(medusa|core/types|medusa-js|medusa-react)/src/**/*.@(ts|tsx|js|jsx)",
      {
        matchBase: true,
      }
    )
  )
}
