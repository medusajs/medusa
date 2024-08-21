import {
    MedusaRequest,
    MedusaResponse,
} from "../../../types/routing"
import { MedusaError } from "@medusajs/utils"
  
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { storageKey, storageValue } = req.body  as { storageKey: string; storageValue: string }

    if (!storageKey || !storageValue) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Missing storageKey or storageValue in the request body."
        )
    }

    res.cookie(storageKey, storageValue, {
        httpOnly: true,
        secure: true,
    })
  
    res.status(200).json({ message: `Saved ${storageKey}-Cookie successfully.` })
}
  
export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { storageKey } = req.query

    if (!storageKey) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Missing storageKey in the request parameters."
        )
    }

    res.cookie(storageKey as string, "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: `Removed the ${storageKey}-Cookie successfully.` });
}
