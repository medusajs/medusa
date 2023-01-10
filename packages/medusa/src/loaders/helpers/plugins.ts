import { ClassConstructor, MedusaContainer } from "../../types/global"
import {
  AbstractPaymentProcessor,
  AbstractPaymentService,
  isPaymentProcessor,
  isPaymentService,
} from "../../interfaces"
import { aliasTo, asFunction } from "awilix"

type Context = {
  container: MedusaContainer
  pluginDetails: Record<string, unknown>
  registrationName: string
}

export function registerPaymentServiceFromClass(
  klass: ClassConstructor<AbstractPaymentService>,
  { container, pluginDetails, registrationName }: Context
): void {
  if (!isPaymentService(klass)) {
    return
  }

  container.registerAdd(
    "paymentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options))
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options)
    ),
    [`pp_${(klass as unknown as typeof AbstractPaymentService).identifier}`]:
      aliasTo(registrationName),
  })
}

export function registerPaymentProcessorFromClass(
  klass: ClassConstructor<AbstractPaymentProcessor>,
  { container, pluginDetails, registrationName }: Context
): void {
  if (!isPaymentProcessor(klass.prototype)) {
    return
  }

  container.registerAdd(
    "paymentProviders",
    asFunction((cradle) => new klass(cradle, pluginDetails.options))
  )

  container.register({
    [registrationName]: asFunction(
      (cradle) => new klass(cradle, pluginDetails.options)
    ),
    [`pp_${(klass as unknown as typeof AbstractPaymentProcessor).identifier}`]:
      aliasTo(registrationName),
  })
}
