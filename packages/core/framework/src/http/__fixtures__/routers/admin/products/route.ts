import { Request, Response } from "express"

export async function GET(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function POST(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function PUT(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function DELETE(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function PATCH(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function OPTIONS(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}

export async function HEAD(req: Request, res: Response): Promise<void> {
  console.log("hello world")
}
