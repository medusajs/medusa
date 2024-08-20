import {
    MedusaRequest,
    MedusaResponse,
} from "../../../types/routing"
import { MedusaError } from "@medusajs/utils"
  
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { jwtTokenStorageKey } = req.scope.resolve("configModule").projectConfig.http
    const { authToken } = req.body as { authToken: string }

    if (!authToken) {
        throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Missing authToken from Body."
        )
    }

    res.cookie(jwtTokenStorageKey, authToken, {
        httpOnly: true,
        secure: true,
    })
  
    res.status(200).json({ message: 'Saved Token to Browser Cookies.' })
}
  
export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const { jwtTokenStorageKey } = req.scope.resolve("configModule").projectConfig.http

    res.cookie(jwtTokenStorageKey as string, "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'Logged out successfully' });
}
