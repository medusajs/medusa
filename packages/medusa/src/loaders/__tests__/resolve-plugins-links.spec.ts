import { mkdirSync, rmSync, writeFileSync } from "fs"
import { resolve } from "path"
import { resolvePluginsLinks } from "../helpers/resolve-plugins-links"
import { createMedusaContainer } from "@medusajs/utils"

const distTestTargetDirectorPath = resolve(__dirname, "__links__")

const getFolderTestTargetDirectoryPath = (folderName: string): string => {
  return resolve(distTestTargetDirectorPath, folderName)
}

const buildLink = (): string => {
  return `
    export default {
      isLink: true
    }
  `
}

describe("resolve plugins link", () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })

    mkdirSync(getFolderTestTargetDirectoryPath("links"), {
      mode: "777",
      recursive: true,
    })
  })

  afterAll(() => {
    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })
  })

  it("should load the custom links", async () => {
    writeFileSync(
      resolve(getFolderTestTargetDirectoryPath("links"), "link.js"),
      buildLink()
    )

    const container = createMedusaContainer({
      logger: console,
    })

    const links = await resolvePluginsLinks(
      [
        {
          resolve: distTestTargetDirectorPath,
        },
      ],
      container
    )

    expect(links).toEqual([
      {
        isLink: true,
      },
    ])
  })
})
