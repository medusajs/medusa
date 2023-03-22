import { ClassConstructor, MedusaContainer } from "../../types/global"
import {
  AbstractPaymentProcessor,
  AbstractPaymentService,
  isPaymentProcessor,
  isPaymentService,
} from "../../interfaces"
import { aliasTo, asFunction, Lifetime, LifetimeType } from "awilix"

type Context = {
  container: MedusaContainer
  pluginDetails: Record<string, unknown>
  registrationName: string
}

export function registerPaymentServiceFromClass(
  klass: ClassConstructor<AbstractPaymentService> & {
    LIFE_TIME?: LifetimeType
  },
  context: Context
): void {
  if (!isPaymentService(klass.prototype)) {
    return
  }

  const { container, pluginDetails, registrationName } = context

  container.registerAdd(
    "paymentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options), {
      lifetime: klass.LIFE_TIME || Lifetime.TRANSIENT,
    })
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.TRANSIENT,
      }
    ),
    [`pp_${(klass as unknown as typeof AbstractPaymentService).identifier}`]:
      aliasTo(registrationName),
  })
}

export function registerPaymentProcessorFromClass(
  klass: ClassConstructor<AbstractPaymentProcessor> & {
    LIFE_TIME?: LifetimeType
  },
  context: Context
): void {
  if (!isPaymentProcessor(klass.prototype)) {
    return
  }

  const { container, pluginDetails, registrationName } = context

  container.registerAdd(
    "paymentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options), {
      lifetime: klass.LIFE_TIME || Lifetime.TRANSIENT,
    })
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.TRANSIENT,
      }
    ),
    [`pp_${(klass as unknown as typeof AbstractPaymentProcessor).identifier}`]:
      aliasTo(registrationName),
  })
}
