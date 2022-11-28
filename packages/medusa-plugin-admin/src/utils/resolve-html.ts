import fse from "fs-extra"
import { UI_PATH } from "../constants/ui-path"

export const resolveHtml = async (url: string) => {
  const html = await fse.readFile(UI_PATH, "utf8")
  const htmlWithBase = html.replace(/<base \/>/, `<base href="${url}/" />`)

  return htmlWithBase
}
