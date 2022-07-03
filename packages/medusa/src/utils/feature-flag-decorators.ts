import { getConfigFile } from "medusa-core-utils"
import { Column, ColumnOptions, Entity, EntityOptions } from "typeorm"
import featureFlagsLoader from "../loaders/feature-flags"
import path from "path"
import { ConfigModule } from "../types/global"

export function FeatureFlagColumn(
  featureFlag: string,
  columnOptions: ColumnOptions
): PropertyDecorator {
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  const featureFlagRouter = featureFlagsLoader(configModule)

  if (!featureFlagRouter.featureIsEnabled(featureFlag)) {
    return (): void => {
      // noop
    }
  }

  return Column(columnOptions)
}

export function featureFlagDecorators(
  featureFlag: string,
  decorators: PropertyDecorator[]
): PropertyDecorator {
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  const featureFlagRouter = featureFlagsLoader(configModule)

  if (!featureFlagRouter.featureIsEnabled(featureFlag)) {
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
  const { configModule } = getConfigFile(
    path.resolve("."),
    `medusa-config`
  ) as { configModule: ConfigModule }

  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function): void {
    target["isEnabled"] = function (): boolean {
      const featureFlagRouter = featureFlagsLoader(configModule)
      return featureFlagRouter.featureIsEnabled(featureFlag)
    }
    Entity(name, options)(target)
  }
}
