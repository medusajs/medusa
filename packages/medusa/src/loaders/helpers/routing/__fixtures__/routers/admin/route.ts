import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function POST(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}
