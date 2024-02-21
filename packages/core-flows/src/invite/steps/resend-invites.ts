import { IUserModuleService, InviteDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export const resendInvitesStepId = "resend-invites-step"
export const resendInvitesStep = createStep(
  resendInvitesStepId,
  async (input: string[], { container }) => {
    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    const createdInvites = await service.resendInvites(input)

    return new StepResponse(
      createdInvites,
      createdInvites.map((inv) => inv.id)
    )
  },
  async (createdInvitesIds, { container }) => {
    if (!createdInvitesIds?.length) {
      return
    }

    const service: IUserModuleService = container.resolve(
      ModuleRegistrationName.USER
    )

    await service.deleteInvites(createdInvitesIds)
  }
)
// export const updateCustomersStepId = "update-customer"
// export const updateCustomersStep = createStep(
//   updateCustomersStepId,
//   async (data: UpdateCustomersStepInput, { container }) => {
//     const service = container.resolve<ICustomerModuleService>(
//       ModuleRegistrationName.CUSTOMER
//     )

//     const { selects, relations } = getSelectsAndRelationsFromObjectArray([
//       data.update,
//     ])
//     const prevCustomers = await service.list(data.selector, {
//       select: selects,
//       relations,
//     })

//     const customers = await service.update(data.selector, data.update)

//     return new StepResponse(customers, prevCustomers)
//   },
//   async (prevCustomers, { container }) => {
//     if (!prevCustomers?.length) {
//       return
//     }

//     const service = container.resolve<ICustomerModuleService>(
//       ModuleRegistrationName.CUSTOMER
//     )

//     await promiseAll(
//       prevCustomers.map((c) =>
//         service.update(c.id, {
//           first_name: c.first_name,
//           last_name: c.last_name,
//           email: c.email,
//           phone: c.phone,
//           metadata: c.metadata,
//         })
//       )
//     )
//   }
// )
