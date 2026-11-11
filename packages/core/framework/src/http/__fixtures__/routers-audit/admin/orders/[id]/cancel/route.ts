import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  res.json({ order: { id: req.params.id } })
}
