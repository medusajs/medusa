import { Request, RequestHandler, Response } from "express";
type handler = (req: Request, res: Response) => Promise<void>;
export declare const wrapHandler: (fn: handler) => RequestHandler;
export {};
/**
 * @schema MultipleErrors
 * title: "Multiple Errors"
 * type: object
 * properties:
 *  errors:
 *    type: array
 *    description: Array of errors
 *    items:
 *      $ref: "#/components/schemas/Error"
 *  message:
 *    type: string
 *    default: "Provided request body contains errors. Please check the data and retry the request"
 */
