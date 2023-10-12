import { Request, Response } from "express"

export const GET = (req: Request, res: Response) => {
  res.send("get customer order")
}

export const POST = (req: Request, res: Response) => {
  res.send("update customer order")
}
