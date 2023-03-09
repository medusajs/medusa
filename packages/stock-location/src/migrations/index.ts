import { getFilesFromPath } from "@medusajs/modules-sdk"

const migrations: object[] = []

getFilesFromPath(__dirname + "/**/*.{ts,js}", ["**/*.d.ts"], (file: string) => {
  migrations.push(require(file))
})

export default migrations
