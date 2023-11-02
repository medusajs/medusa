import { Request, Response } from "express"

export const POST = (req: Request, res: Response) => {
  // If req.body is not of type Buffer, then the body parser middleware was applied and we should throw and error
  if (!(req.body instanceof Buffer)) {
    throw new Error("Body parser middleware was applied")
  }

  res.send("OK")
}
