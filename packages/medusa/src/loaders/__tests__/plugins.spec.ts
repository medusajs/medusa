import {
  asValue,
  AwilixContainer,
  ClassOrFunctionReturning,
  Resolver,
} from "awilix"
import { mkdirSync, rmSync, writeFileSync } from "fs"
import { resolve } from "path"
import Logger from "../logger"
import { registerServices, registerStrategies } from "../plugins"
import { DataSource, EntityManager } from "typeorm"
import { createMedusaContainer } from "medusa-core-utils"

// ***** TEMPLATES *****
const buildServiceTemplate = (name: string): string => {
  return `
    import { BaseService } from "medusa-interfaces"
    export default class ${name}Service extends BaseService {}
  `
}
const buildTransactionBaseServiceServiceTemplate = (name: string) => {
  return `
    import { TransactionBaseService } from "${resolve(
      __dirname,
      "../../interfaces"
    )}"
    export default class ${name}Service extends TransactionBaseService {}
  `
}

const buildBatchJobStrategyTemplate = (name: string, type: string): string => {
  return `
  import { AbstractBatchJobStrategy } from "../../../../interfaces/batch-job-strategy"

  class ${name}BatchStrategy extends AbstractBatchJobStrategy{
    static identifier = '${name}-identifier';
    static batchType = '${type}';

    manager_
    transactionManager_

    validateContext(context) {
      throw new Error("Method not implemented.")
    }
    processJob(batchJobId) {
      throw new Error("Method not implemented.")
    }
    completeJob(batchJobId) {
      throw new Error("Method not implemented.")
    }
    validateFile(fileLocation) {
      throw new Error("Method not implemented.")
    }
    async buildTemplate() {
      throw new Error("Method not implemented.")
    }
  }

  export default  ${name}BatchStrategy
  `
}

const buildPriceSelectionStrategyTemplate = (name: string): string => {
  return `
  import { AbstractPriceSelectionStrategy } from "../../../../interfaces/price-selection-strategy"

  class ${name}PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
    withTransaction() {
      throw new Error("Method not implemented.");
    }
    calculateVariantPrice(variant_id, context) {
      throw new Error("Method not implemented.");
    }
  }

  export default ${name}PriceSelectionStrategy
  `
}

const buildTaxCalcStrategyTemplate = (name: string): string => {
  return `
  class ${name}TaxCalculationStrategy {
    calculate(items, taxLines, calculationContext) {
      throw new Error("Method not implemented.")
    }
  }

  export default ${name}TaxCalculationStrategy
  `
}

// ***** UTILS *****

const distTestTargetDirectorPath = resolve(__dirname, "__pluginsLoaderTest__")

const getFolderTestTargetDirectoryPath = (folderName: string): string => {
  return resolve(distTestTargetDirectorPath, folderName)
}

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer): unknown[] =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

// ***** TESTS *****

describe("plugins loader", () => {
  const container = createMedusaContainer()

  container.register("logger", asValue(Logger))
  container.register("manager", asValue(new EntityManager({} as DataSource)))

  const pluginsDetails = {
    resolve: resolve(__dirname, "__pluginsLoaderTest__"),
    name: `project-plugin`,
    id: "fakeId",
    options: {},
    version: '"fakeVersion',
  }
  let err

  afterAll(() => {
    rmSync(distTestTargetDirectorPath, { recursive: true, force: true })
    jest.clearAllMocks()
  })

  describe("registerStrategies", function () {
    beforeAll(async () => {
      mkdirSync(getFolderTestTargetDirectoryPath("strategies"), {
        mode: "777",
        recursive: true,
      })
      writeFileSync(
        resolve(
          getFolderTestTargetDirectoryPath("strategies"),
          "test-batch-1.js"
        ),
        buildBatchJobStrategyTemplate("testBatch1", "type-1")
      )
      writeFileSync(
        resolve(
          getFolderTestTargetDirectoryPath("strategies"),
          "test-price-selection.js"
        ),
        buildPriceSelectionStrategyTemplate("test")
      )
      writeFileSync(
        resolve(
          getFolderTestTargetDirectoryPath("strategies"),
          "test-batch-2.js"
        ),
        buildBatchJobStrategyTemplate("testBatch2", "type-1")
      )
      writeFileSync(
        resolve(
          getFolderTestTargetDirectoryPath("strategies"),
          "test-batch-3.js"
        ),
        buildBatchJobStrategyTemplate("testBatch3", "type-2")
      )
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("strategies"), "test-tax.js"),
        buildTaxCalcStrategyTemplate("test")
      )

      try {
        await registerStrategies(pluginsDetails, container)
      } catch (e) {
        err = e
      }
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("err should be falsy", () => {
      expect(err).toBeFalsy()
    })

    it("registers price selection strategy", () => {
      const priceSelectionStrategy = container.resolve(
        "priceSelectionStrategy"
      ) as (...args: unknown[]) => any

      expect(priceSelectionStrategy).toBeTruthy()
      expect(priceSelectionStrategy.constructor.name).toBe(
        "testPriceSelectionStrategy"
      )
    })

    it("registers tax calculation strategy", () => {
      const taxCalculationStrategy = container.resolve(
        "taxCalculationStrategy"
      ) as (...args: unknown[]) => any

      expect(taxCalculationStrategy).toBeTruthy()
      expect(taxCalculationStrategy.constructor.name).toBe(
        "testTaxCalculationStrategy"
      )
    })

    it("registers batch job strategies as single array", () => {
      const batchJobStrategies = container.resolve("batchJobStrategies") as (
        ...args: unknown[]
      ) => any

      expect(batchJobStrategies).toBeTruthy()
      expect(Array.isArray(batchJobStrategies)).toBeTruthy()
      expect(batchJobStrategies.length).toBe(3)
    })

    it("registers batch job strategies by type and only keep the last", () => {
      const batchJobStrategy = container.resolve("batchType_type-1") as (
        ...args: unknown[]
      ) => any

      expect(batchJobStrategy).toBeTruthy()
      expect(batchJobStrategy.constructor.name).toBe("testBatch2BatchStrategy")
      expect((batchJobStrategy.constructor as any).batchType).toBe("type-1")
      expect((batchJobStrategy.constructor as any).identifier).toBe(
        "testBatch2-identifier"
      )
    })

    it("registers batch job strategies by identifier", () => {
      const batchJobStrategy = container.resolve(
        "batch_testBatch3-identifier"
      ) as (...args: unknown[]) => any

      expect(batchJobStrategy).toBeTruthy()
      expect(Array.isArray(batchJobStrategy)).toBeFalsy()
      expect(batchJobStrategy.constructor.name).toBe("testBatch3BatchStrategy")
    })
  })

  describe("registerServices", function () {
    beforeAll(() => {
      container.register("logger", asValue(Logger))
      mkdirSync(getFolderTestTargetDirectoryPath("services"), {
        mode: "777",
        recursive: true,
      })
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("services"), "test.js"),
        buildServiceTemplate("test")
      )
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("services"), "test2.js"),
        buildServiceTemplate("test2")
      )
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("services"), "test3.js"),
        buildTransactionBaseServiceServiceTemplate("test3")
      )
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("services"), "test2.js.map"),
        "map:file"
      )
      writeFileSync(
        resolve(getFolderTestTargetDirectoryPath("services"), "test2.d.ts"),
        "export interface Test {}"
      )
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("should load the services from the services directory but only js files", async () => {
      let err
      try {
        await registerServices(pluginsDetails, container)
      } catch (e) {
        err = e
      }

      expect(err).toBeFalsy()

      const testService: (...args: unknown[]) => any =
        container.resolve("testService")
      const test2Service: (...args: unknown[]) => any =
        container.resolve("test2Service")
      const test3Service: (...args: unknown[]) => any =
        container.resolve("test3Service")

      expect(testService).toBeTruthy()
      expect(testService.constructor.name).toBe("testService")
      expect(test2Service).toBeTruthy()
      expect(test2Service.constructor.name).toBe("test2Service")
      expect(test3Service).toBeTruthy()
      expect(test3Service.constructor.name).toBe("test3Service")
    })
  })
})
