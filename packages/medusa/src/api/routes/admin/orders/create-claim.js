import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    type: Validator.string()
      .valid("replace", "refund")
      .required(),
    claim_items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
        note: Validator.string().optional(),
        reason: Validator.string().valid(
          "missing_item",
          "wrong_item",
          "production_failure",
          "other"
        ),
        tags: Validator.array().items(Validator.string()),
        images: Validator.array().items(Validator.string()),
      })
      .required(),
    return_shipping: Validator.object()
      .keys({
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    additional_items: Validator.array()
      .items({
        variant_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .optional(),
    shipping_methods: Validator.array()
      .items({
        id: Validator.string().optional(),
        option_id: Validator.string().optional(),
        price: Validator.number()
          .integer()
          .optional(),
      })
      .optional(),
    refund_amount: Validator.number()
      .integer()
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const idempotencyKeyService = req.scope.resolve("idempotencyKeyService")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    idempotencyKey = await idempotencyKeyService.initializeRequest(
      headerKey,
      req.method,
      req.params,
      req.path
    )
  } catch (error) {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  try {
    const orderService = req.scope.resolve("orderService")
    const claimService = req.scope.resolve("claimService")
    const returnService = req.scope.resolve("returnService")

    let inProgress = true
    let err = false

    while (inProgress) {
      switch (idempotencyKey.recovery_point) {
        case "started": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              const order = await orderService
                .withTransaction(manager)
                .retrieve(id, {
                  relations: ["items", "discounts"],
                })

              await claimService.withTransaction(manager).create({
                idempotency_key: idempotencyKey.idempotency_key,
                order,
                type: value.type,
                claim_items: value.claim_items,
                return_shipping: value.return_shipping,
                additional_items: value.additional_items,
                shipping_methods: value.shipping_methods,
                metadata: value.metadata,
              })

              return {
                recovery_point: "claim_created",
              }
            }
          )

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
          break
        }

        case "claim_created": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              let claim = await claimService.withTransaction(manager).list({
                idempotency_key: idempotencyKey.idempotency_key,
              })

              if (!claim.length) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `Claim not found`
                )
              }

              claim = claim[0]

              if (claim.type === "refund") {
                await claimService
                  .withTransaction(manager)
                  .processRefund(claim.id)
              }

              return {
                recovery_point: "refund_handled",
              }
            }
          )

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
          break
        }

        case "refund_handled": {
          const { key, error } = await idempotencyKeyService.workStage(
            idempotencyKey.idempotency_key,
            async manager => {
              let order = await orderService
                .withTransaction(manager)
                .retrieve(id, {
                  relations: ["items", "discounts"],
                })

              let claim = await claimService.withTransaction(manager).list(
                {
                  idempotency_key: idempotencyKey.idempotency_key,
                },
                {
                  relations: ["return_order"],
                }
              )

              if (!claim.length) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `Claim not found`
                )
              }

              claim = claim[0]

              if (claim.return_order) {
                await returnService
                  .withTransaction(manager)
                  .fulfill(claim.return_order.id)
              }

              order = await orderService.withTransaction(manager).retrieve(id, {
                select: defaultFields,
                relations: defaultRelations,
              })

              return {
                response_code: 200,
                response_body: { order },
              }
            }
          )

          if (error) {
            inProgress = false
            err = error
          } else {
            idempotencyKey = key
          }
          break
        }

        case "finished": {
          inProgress = false
          break
        }

        default:
          idempotencyKey = await idempotencyKeyService.update(
            idempotencyKey.idempotency_key,
            {
              recovery_point: "finished",
              response_code: 500,
              response_body: { message: "Unknown recovery point" },
            }
          )
          break
      }
    }

    if (err) {
      throw err
    }

    res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
  } catch (error) {
    throw error
  }
}
