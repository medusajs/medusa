import { aliasTo, asFunction, Lifetime, LifetimeType } from "awilix"
import {
  AbstractFulfillmentService,
  AbstractPaymentProcessor,
} from "../../interfaces"
import { ClassConstructor, MedusaContainer } from "../../types/global"
import { PaymentService } from "medusa-interfaces"

type Context = {
  container: MedusaContainer
  pluginDetails: Record<string, unknown>
  registrationName: string
}

export function registerPaymentProcessorFromClass(
  klass: ClassConstructor<AbstractPaymentProcessor> & {
    LIFE_TIME?: LifetimeType
  },
  context: Context
): void {
  if (
    !AbstractPaymentProcessor.isPaymentProcessor(klass.prototype)
  ) {
    return
  }

  const { container, pluginDetails, registrationName } = context

  container.registerAdd(
    "paymentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    })
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
    [`pp_${(klass as unknown as typeof AbstractPaymentProcessor).identifier}`]:
      aliasTo(registrationName),
  })
}

export function registerAbstractFulfillmentServiceFromClass(
  klass: ClassConstructor<AbstractFulfillmentService> & {
    LIFE_TIME?: LifetimeType
  },
  context: Context
): void {
  if (!AbstractFulfillmentService.isFulfillmentService(klass.prototype)) {
    return
  }

  const { container, pluginDetails, registrationName } = context

  container.registerAdd(
    "fulfillmentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    })
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
    [`fp_${
      (klass as unknown as typeof AbstractFulfillmentService).identifier
    }`]: aliasTo(registrationName),
  })
}
