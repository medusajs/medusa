export const GET = async (req: Request, res: Response) => {
  throw {
    code: "NOT_ALLOWED",
    message: "Not allowed to perform this action",
  }
}

export const POST = async (req: Request, res: Response) => {
  throw {
    code: "INVALID_DATA",
    message: "Invalid data provided",
  }
}

export const PUT = async (req: Request, res: Response) => {
  throw {
    code: "CONFLICT",
    message: "Conflict with another request",
  }
}

export const DELETE = async (req: Request, res: Response) => {
  throw {
    code: "TEAPOT",
    message: "I'm a teapot",
  }
}
