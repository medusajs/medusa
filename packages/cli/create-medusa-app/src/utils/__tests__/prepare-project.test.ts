import fs from "fs"
import os from "os"
import path from "path"
import prepareProject from "../prepare-project"

jest.mock("../facts", () => ({
  displayFactBox: jest.fn().mockReturnValue(null),
}))

describe("prepareProject", () => {
  describe("plugin", () => {
    let directory: string

    beforeEach(() => {
      directory = fs.mkdtempSync(path.join(os.tmpdir(), "cma-plugin-"))
      fs.writeFileSync(
        path.join(directory, "package.json"),
        JSON.stringify({
          name: "starter",
          devDependencies: {
            "@medusajs/medusa": "2.0.0",
            "@medusajs/ui": "4.0.0",
          },
          peerDependencies: {
            "@medusajs/framework": "2.0.0",
          },
        })
      )
    })

    afterEach(() => {
      fs.rmSync(directory, { recursive: true, force: true })
    })

    it("should update the plugin's @medusajs package versions when a version is passed", async () => {
      const packageManager = {
        getPackageManagerString: jest.fn().mockResolvedValue(undefined),
        installDependencies: jest.fn().mockResolvedValue(undefined),
      }

      await prepareProject({
        isPlugin: true,
        directory,
        projectName: "my-plugin",
        spinner: {} as any,
        processManager: {} as any,
        packageManager: packageManager as any,
        version: "2.5.0",
      })

      const packageJson = JSON.parse(
        fs.readFileSync(path.join(directory, "package.json"), "utf-8")
      )

      expect(packageJson.name).toBe("my-plugin")
      expect(packageJson.devDependencies).toEqual({
        "@medusajs/medusa": "2.5.0",
        "@medusajs/ui": "4.0.0",
      })
      expect(packageJson.peerDependencies).toEqual({
        "@medusajs/framework": "2.5.0",
      })
    })
  })
})
