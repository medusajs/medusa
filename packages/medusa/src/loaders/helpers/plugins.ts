import { Lifetime, LifetimeType, aliasTo, asFunction } from "awilix"
import { FulfillmentService } from "medusa-interfaces"
import {
  AbstractFulfillmentService,
  AbstractPaymentProcessor,
  AbstractPaymentService,
  isPaymentProcessor,
  isPaymentService,
} from "../../interfaces"
import { ClassConstructor, MedusaContainer } from "../../types/global"

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
  if (!(klass.prototype instanceof AbstractFulfillmentService)) {
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

export function registerFulfillmentServiceFromClass(
  klass: ClassConstructor<typeof FulfillmentService> & {
    LIFE_TIME?: LifetimeType
  },
  context: Context
): void {
  if (!(klass.prototype instanceof FulfillmentService)) {
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
    [`fp_${(klass as unknown as typeof FulfillmentService).identifier}`]:
      aliasTo(registrationName),
  })
}
