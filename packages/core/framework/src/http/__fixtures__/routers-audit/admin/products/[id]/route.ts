import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  res.json({ product: { id: req.params.id } })
}

export const DELETE = (req: Request, res: Response) => {
  res.json({ id: req.params.id, deleted: true })
}
