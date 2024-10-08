import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}
