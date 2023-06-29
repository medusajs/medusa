import { Request, Response } from 'express';

export function getCustomerOrder(req: Request, res: Response) {
    /* const customerId = req.params.id;
    const orderId = req.params.id;*/
    res.send('list customers ' + JSON.stringify(req.params));
}

export const config = {
    routes: [{
        method: 'get',
        handlers: [getCustomerOrder],
    },
    ],
};
