"use server"

import { LoopsClient } from "loops"

export const subscribeToNewsletter = async (email: string) => {
  try {
    const loops = new LoopsClient(process.env.LOOPS_API_KEY as string)

    await loops.updateContact({
      email: email,
    })

    return { success: true }
  } catch (error) {
    const message = (error as Error).message
    const messageParts = message.split(" - ")
    return {
      success: false,
      message:
        messageParts[0] === "400"
          ? messageParts[1]
          : "An error occurred. Please try again later.",
    }
  }
}
