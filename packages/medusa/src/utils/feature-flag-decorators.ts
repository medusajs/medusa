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
    setImmediate((): any => {
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
    setImmediate((): any => {
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
