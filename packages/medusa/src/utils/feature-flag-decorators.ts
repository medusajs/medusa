 import { getConfigFile } from "medusa-core-utils"
import { Column, ColumnOptions, Entity, EntityOptions } from "typeorm"
import featureFlagsLoader from "../loaders/feature-flags"
import path from "path"
import { ConfigModule } from "../types/global"
import { FlagRouter } from "./flag-router"

export function FeatureFlagColumn(
  featureFlag: string,
  columnOptions: ColumnOptions = {}
): PropertyDecorator {
  return function (target, propertyName) {
    const wrapper = getDecoratorWrapper()
    wrapper((): any => {
      const featureFlagRouter = getFeatureFlagRouter()

      if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
        return
      }

      Column(columnOptions)(target, propertyName)
    })
  }
}

export function FeatureFlagDecorators(
  featureFlag: string,
  decorators: PropertyDecorator[]
): PropertyDecorator {
  return function (target, propertyName) {
    const wrapper = getDecoratorWrapper()
    wrapper((): any => {
      const featureFlagRouter = getFeatureFlagRouter()

      if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
        return
      }

      decorators.forEach((decorator: PropertyDecorator) => {
        decorator(target, propertyName)
      })
    })
  }
}

export function FeatureFlagEntity(
  featureFlag: string,
  name?: string,
  options?: EntityOptions
): ClassDecorator {
  return function (target: Function): void {
    target["isFeatureEnabled"] = function (): boolean {
      const featureFlagRouter = getFeatureFlagRouter()

      return featureFlagRouter.isFeatureEnabled(featureFlag)
    }
    Entity(name, options)(target)
  }
}

function getFeatureFlagRouter(): FlagRouter {
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  return featureFlagsLoader(configModule)
}

 /**
  * Seams like jest is treating the timer a bit differently than a real environment,
  * therefore one approach is to mock the setImmediate in test env.
  * If anybody has another idea that could solution that behavior that end up rejecting the tests with the folloowing
  * error, it would be welcome:
  * ReferenceError: You are trying to `import` a file after the Jest environment has been torn down.
  */
 function getDecoratorWrapper() {
  const wrapper = process.env.NODE === "test"
      ? (callback) => callback()
      : (callback) => setImmediate(callback)
  return wrapper
}
