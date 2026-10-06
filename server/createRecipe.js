const SYSTEM_PROMPT = `You are Chef Claude, an assistant that receives a list of ingredients a user has and suggests a recipe they could make with some or all of those ingredients. You do not need to use every ingredient. The recipe can include a few extra common ingredients, but not too many. Format the response in markdown with a short introduction, the recipe title as a heading, an Ingredients list, and numbered Instructions.`

const MODEL = "Qwen/Qwen3-4B-Instruct-2507:cheapest"

export class RecipeError extends Error {
    constructor(message, status = 500) {
        super(message)
        this.name = "RecipeError"
        this.status = status
    }
}

export function normalizeIngredients(ingredients) {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new RecipeError("Add at least one ingredient.", 400)
    }
    if (ingredients.length > 30) {
        throw new RecipeError("Use 30 ingredients or fewer.", 400)
    }

    return ingredients.map((ingredient) => {
        if (typeof ingredient !== "string") {
            throw new RecipeError("Each ingredient must be text.", 400)
        }
        const trimmed = ingredient.trim()
        if (trimmed === "" || trimmed.length > 80) {
            throw new RecipeError("Each ingredient must be 1–80 characters.", 400)
        }
        return trimmed
    })
}

export async function createRecipe(ingredients, token) {
    const list = normalizeIngredients(ingredients)
    const trimmedToken = typeof token === "string" ? token.trim() : ""
    if (trimmedToken === "") {
        throw new RecipeError(
            "Recipe generation is not configured. Add the Hugging Face token on the server and redeploy.",
            500
        )
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${trimmedToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: `I have ${list.join(", ")}. Please give me a recipe you would recommend I make.`,
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
        throw new RecipeError(message, response.status === 401 ? 502 : 502)
    }

    const content = data?.choices?.[0]?.message?.content
    if (typeof content !== "string" || content.trim() === "") {
        throw new RecipeError("The model returned an empty recipe.", 502)
    }

    return content
}
