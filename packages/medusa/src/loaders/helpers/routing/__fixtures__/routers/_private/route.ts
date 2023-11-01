import { Request, Response } from "express"

export const GET = async (req: Request, res: Response): Promise<void> => {
  res.send(`GET private route`)
}
