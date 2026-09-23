const SYSTEM_PROMPT = `You are Chef Claude, an assistant that receives a list of ingredients a user has and suggests a recipe they could make with some or all of those ingredients. You do not need to use every ingredient. The recipe can include a few extra common ingredients, but not too many. Format the response in markdown with a short introduction, the recipe title as a heading, an Ingredients list, and numbered Instructions.`

const MODEL = "Qwen/Qwen3-4B-Instruct-2507:cheapest"

export async function getRecipeFromIngredients(ingredients) {
    const token = import.meta.env.VITE_HF_TOKEN
    if (!token || token.trim() === "") {
        throw new Error(
            "Add your Hugging Face token to the .env file as VITE_HF_TOKEN, then restart the dev server."
        )
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.trim()}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `I have ${ingredients.join(", ")}. Please give me a recipe you would recommend I make.`,
                },
            ],
            max_tokens: 1024,
        }),
    })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
        const apiError = data?.error
        const message =
            (typeof apiError === "string" && apiError) ||
            apiError?.message ||
            `The recipe request failed (${response.status}).`
        throw new Error(message)
    }

    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== "string" || content.trim() === "") {
        throw new Error("The model returned an empty recipe.")
    }

    return content
}
