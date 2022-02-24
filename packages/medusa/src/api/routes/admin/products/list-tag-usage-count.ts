import { ProductService } from "../../../../services"
import { Request } from "@interfaces/http"

export default async (req: Request, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const tags = await productService.listTagsByUsage()

  res.json({ tags })
}
