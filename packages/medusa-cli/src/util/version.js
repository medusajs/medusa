import { getMedusaVersion } from "medusa-core-utils"

export const getLocalMedusaVersion = () => {
  const version = getMedusaVersion()
  return version
}
