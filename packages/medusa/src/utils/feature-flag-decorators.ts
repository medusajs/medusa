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
  const featureFlagRouter = getFeatureFlagRouter()

  if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
    return (): void => {
      // noop
    }
  }

  return Column(columnOptions)
}

export function FeatureFlagDecorators(
  featureFlag: string,
  decorators: PropertyDecorator[]
): PropertyDecorator {
  const featureFlagRouter = getFeatureFlagRouter()

  if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
    return (): void => {
      // noop
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol): void => {
    decorators.forEach((decorator) => {
      decorator(target, propertyKey)
    })
  }
}

export function FeatureFlagEntity(
  featureFlag: string,
  name?: string,
  options?: EntityOptions
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function): void {
    target["isFeatureEnabled"] = function (): boolean {
      const featureFlagRouter = getFeatureFlagRouter()

      // const featureFlagRouter = featureFlagsLoader(configModule)
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
