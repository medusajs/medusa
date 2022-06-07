import { createContainer, asValue } from "awilix"
import { mkdirSync, rmSync, rmdirSync, writeFileSync } from "fs"
import { resolve } from "path"
import Logger from "../logger"
import { registerServices } from "../plugins"
import { MedusaContainer } from "../../types/global"

const distTestTargetDirectorPath = resolve(__dirname, "__pluginsLoaderTest__")
const servicesTestTargetDirectoryPath = resolve(distTestTargetDirectorPath, "services")
const buildServiceTemplate = (name: string) => {
  return `
    import { BaseService } from "medusa-interfaces"
    export default class ${name}Service extends BaseService {}
  `
}

describe('plugins loader', () => {
  const container = createContainer() as MedusaContainer
  const pluginsDetails = {
    resolve: resolve(__dirname, "__pluginsLoaderTest__"),
    name: `project-plugin`,
    id: "fakeId",
    options: {},
    version: '"fakeVersion',
  }

  describe("registerServices", function() {
    beforeAll(() => {
      container.register("logger", asValue(Logger))
      mkdirSync(servicesTestTargetDirectoryPath, { mode: "777", recursive: true })
      writeFileSync(resolve(servicesTestTargetDirectoryPath, "test.js"), buildServiceTemplate("test"))
      writeFileSync(resolve(servicesTestTargetDirectoryPath, "test2.js"), buildServiceTemplate("test2"))
      writeFileSync(resolve(servicesTestTargetDirectoryPath, "test2.js.map"), "map:file")
      writeFileSync(resolve(servicesTestTargetDirectoryPath, "test2.d.ts"), "export interface Test {}")
    })

    afterAll(() => {
      rmSync(distTestTargetDirectorPath, { recursive: true, force: true })
      jest.clearAllMocks()
    })

    it('should load the services from the services directory but only js files', async () => {
      let err;
      try {
        await registerServices(pluginsDetails, container)
      } catch (e) {
        err = e
      }

      expect(err).toBeFalsy()

      const testService: (...args: unknown[]) => any = container.resolve("testService")
      const test2Service: (...args: unknown[]) => any = container.resolve("test2Service")

      expect(testService).toBeTruthy()
      expect(testService.constructor.name).toBe("testService")
      expect(test2Service).toBeTruthy()
      expect(test2Service.constructor.name).toBe("test2Service")
    })
  })
})