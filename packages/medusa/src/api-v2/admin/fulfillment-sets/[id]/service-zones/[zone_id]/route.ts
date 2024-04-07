import {
  deleteServiceZonesWorkflow,
  updateServiceZonesWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminUpdateFulfillmentSetServiceZonesType } from "../../../validators"

export const POST = async (
  req: MedusaRequest<AdminUpdateFulfillmentSetServiceZonesType>,
  res: MedusaResponse
) => {
  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  // ensure fulfillment set exists and that the service zone is part of it
  const fulfillmentSet = await fulfillmentModuleService.retrieve(
    req.params.id,
    { relations: ["service_zones"] }
  )

  if (!fulfillmentSet.service_zones.find((s) => s.id === req.params.zone_id)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Service zone with id: ${req.params.zone_id} not found on fulfillment set`
    )
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const workflowInput = {
    selector: { id: req.params.zone_id },
    update: req.validatedBody,
  }

  const { errors } = await updateServiceZonesWorkflow(req.scope).run({
    input: workflowInput,
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const [fulfillment_set] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "fulfillment_sets",
      variables: {
        id: req.params.id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({ fulfillment_set })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id, zone_id } = req.params

  const fulfillmentModuleService = req.scope.resolve<IFulfillmentModuleService>(
    ModuleRegistrationName.FULFILLMENT
  )

  // ensure fulfillment set exists and that the service zone is part of it
  const fulfillmentSet = await fulfillmentModuleService.retrieve(
    req.params.id,
    { relations: ["service_zones"] }
  )

  if (!fulfillmentSet.service_zones.find((s) => s.id === req.params.zone_id)) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Service zone with id: ${req.params.zone_id} not found on fulfillment set`
    )
  }

  const { errors } = await deleteServiceZonesWorkflow(req.scope).run({
    input: { ids: [zone_id] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({
    id: zone_id,
    object: "service-zone",
    deleted: true,
    parent: fulfillmentSet,
  })
}
