import { updatePackageVersions } from "../update-package-versions"

describe("updatePackageVersions", () => {
  it("should update @medusajs dependencies, devDependencies, and peerDependencies except @medusajs/ui", () => {
    const packageJson = {
      dependencies: {
        "@medusajs/medusa": "2.0.0",
        "@medusajs/ui": "4.0.0",
        lodash: "4.0.0",
      },
      devDependencies: {
        "@medusajs/cli": "2.0.0",
        typescript: "5.0.0",
      },
      peerDependencies: {
        "@medusajs/framework": "2.0.0",
        "@medusajs/ui": "4.0.0",
        react: "18.0.0",
      },
    }

    const result = updatePackageVersions(packageJson, "2.5.0")

    expect(result).toEqual({
      dependencies: {
        "@medusajs/medusa": "2.5.0",
        "@medusajs/ui": "4.0.0",
        lodash: "4.0.0",
      },
      devDependencies: {
        "@medusajs/cli": "2.5.0",
        typescript: "5.0.0",
      },
      peerDependencies: {
        "@medusajs/framework": "2.5.0",
        "@medusajs/ui": "4.0.0",
        react: "18.0.0",
      },
    })
  })
})
