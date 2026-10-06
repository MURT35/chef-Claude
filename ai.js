export async function getRecipeFromIngredients(ingredients) {
    const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
    })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
        throw new Error(data?.error || `The recipe request failed (${response.status}).`)
    }

    const content = data?.recipe
    if (typeof content !== "string" || content.trim() === "") {
        throw new Error("The model returned an empty recipe.")
    }

    return content
}
