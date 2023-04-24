export const getErrorStatus = (error: Error): { status: number, message: string} | undefined => {
    const formattedError = JSON.parse(JSON.stringify(error))

    if ("status" in formattedError && "message" in formattedError) {
        return { status: formattedError.status, message: formattedError.message }
    }

    return undefined
}