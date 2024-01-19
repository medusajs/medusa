import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { loadCustomRepositories } from "@medusajs/utils"
import { asClass } from "awilix"

import * as defaultRepositories from "@repositories"
import * as defaultServices from "@services"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    paymentCollectionService: asClass(
      defaultServices.PaymentCollection
    ).singleton(),
    paymentService: asClass(defaultServices.Payment).singleton(),
    paymentSessionService: asClass(defaultServices.PaymentSession).singleton(),
  })

  if (customRepositories) {
    loadCustomRepositories({
      defaultRepositories,
      customRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(defaultRepositories.BaseRepository).singleton(),
    paymentCollectionRepository: asClass(
      defaultRepositories.PaymentCollectionRepository
    ).singleton(),
    paymentRepository: asClass(
      defaultRepositories.PaymentRepository
    ).singleton(),
    paymentSessionRepository: asClass(
      defaultRepositories.PaymentSessionRepository
    ).singleton(),
    captureRepository: asClass(
      defaultRepositories.CaptureRepository
    ).singleton(),
    refundRepository: asClass(defaultRepositories.RefundRepository).singleton(),
  })
}
