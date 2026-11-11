import { Request, Response } from "express"

export const GET = (req: Request, res: Response) => {
  res.json({ products: [] })
}

export const POST = (req: Request, res: Response) => {
  res.json({ product: { id: "prod_new", title: req.body?.title } })
}
