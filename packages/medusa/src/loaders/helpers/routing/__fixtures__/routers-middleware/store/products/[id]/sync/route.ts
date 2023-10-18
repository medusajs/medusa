import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  res.send(`sync product ${req.params.id}`)
}
