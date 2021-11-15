import { IsString } from "class-validator"
import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { validator } from "../../../../utils/validator"

export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(
    AdminPostProductsProductMetadataReq,
    req.body
  )

  const productService = req.scope.resolve("productService")
  await productService.update(id, {
    metadata: { [validated.key]: validated.value },
  })

  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.status(200).json({ product })
}

export class AdminPostProductsProductMetadataReq {
  @IsString()
  key: string

  @IsString()
  value: string
}
