import { Request, Response } from "express"

export async function listProducts(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function listProducts2(
  req: Request,
  res: Response
): Promise<void> {
  console.log("hello world")
}

export const config = {
  routes: [
    {
      method: "get",
      handlers: [listProducts],
    },
    {
      method: "post",
      handlers: [listProducts2],
    },
  ],
}
