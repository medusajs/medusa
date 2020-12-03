import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const selector = {}

  if ("ids" in req.query) {
    selector["_id"] = { $in: req.query.ids.split(",") }
  }

  const variantService = req.scope.resolve("productVariantService")
  const variants = await variantService.list(selector)

  let includeFields = [
    "title",
    "prices",
    "sku",
    "ean",
    "image",
    "inventory_quantity",
    "allow_backorder",
    "manage_inventory",
  ]
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
  }

  const data = await Promise.all(
    variants.map(v => variantService.decorate(v, includeFields))
  )
  res.json({ variants: data })
}
