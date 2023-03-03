import { getFilesFromPath } from "@medusajs/modules-sdk"

const migrations: object[] = []
getFilesFromPath("./**/*.{js|ts}", ["index.js", "index.ts"], (file: string) => {
  migrations.push(require(file))
})

export default migrations
