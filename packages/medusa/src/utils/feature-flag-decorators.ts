import { Column, ColumnOptions, Entity, EntityOptions } from "typeorm"
import { featureFlagRouter } from "../loaders/feature-flags"
import { Equals, ValidateIf } from "class-validator"
import { isDefined } from "@medusajs/utils"

/**
 * If that file is required in a non node environment then the setImmediate timer does not exists.
 * This can happen when a client package require a server based package and that one of the import
 * require to import that file which is using the setImmediate.
 * In order to take care of those cases, the setImmediate timer will use the one provided by the api (node)
 * if possible and will provide a mock in a browser like environment.
 */
let setImmediate_
try {
  setImmediate_ = setImmediate
} catch (e) {
  console.warn(
    "[feature-flag-decorator.ts] setImmediate will use a mock, this happen when this file is required in a browser environment and should not impact you"
  )
  setImmediate_ = async (callback: () => void | Promise<void>) => callback()
}

export function FeatureFlagColumn(
  featureFlag: string,
  columnOptions: ColumnOptions = {}
): PropertyDecorator {
  return function (target, propertyName) {
    setImmediate_((): any => {
      if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
        return
      }

      Column(columnOptions)(target, propertyName)
    })
  }
}

export function FeatureFlagDecorators(
  featureFlag: string | string[],
  decorators: PropertyDecorator[]
): PropertyDecorator {
  return function (target, propertyName) {
    setImmediate_((): any => {
      if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
        ValidateIf((o) => isDefined(o[propertyName]))(target, propertyName)
        Equals(undefined, {
          message: `${propertyName as string} should not exist`,
        })(target, propertyName)
        return
      }

      decorators.forEach((decorator: PropertyDecorator) => {
        decorator(target, propertyName)
      })
    })
  }
}

export function FeatureFlagClassDecorators(
  featureFlag: string | string[],
  decorators: ClassDecorator[]
): ClassDecorator {
  return function (target) {
    setImmediate_((): any => {
      if (!featureFlagRouter.isFeatureEnabled(featureFlag)) {
        return
      }

      decorators.forEach((decorator: ClassDecorator) => {
        decorator(target)
      })
    })
  }
}

export function FeatureFlagEntity(
  featureFlag: string | string[],
  name?: string,
  options?: EntityOptions
): ClassDecorator {
  return function (target: Function): void {
    target["isFeatureEnabled"] = function (): boolean {
      return featureFlagRouter.isFeatureEnabled(featureFlag)
    }
    Entity(name, options)(target)
  }
}
