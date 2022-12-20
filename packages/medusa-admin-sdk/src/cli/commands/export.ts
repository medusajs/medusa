import prompts from "prompts"

export async function exportUi() {
  const results = await prompts([
    {
      type: "text",
      name: "backendUrl",
      message: "What is the backend URL?",
    },
  ])

  console.log(results)
}
