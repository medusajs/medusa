import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request, res: Response): Promise<void> {
    console.log('hello world');
}

export const config = {
    ignore: true,
};
