import { createRecipe, RecipeError } from "../../server/createRecipe.js"

export default async (req) => {
    if (req.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 })
    }

    let body
    try {
        body = await req.json()
    } catch {
        return Response.json({ error: "Invalid request." }, { status: 400 })
    }

    const token = process.env.HF_TOKEN || process.env.VITE_HF_TOKEN || ""

    try {
        const recipe = await createRecipe(body?.ingredients, token)
        return Response.json({ recipe })
    } catch (err) {
        const status = err instanceof RecipeError ? err.status : 500
        const message = err instanceof Error && err.message ? err.message : "Could not get a recipe."
        return Response.json({ error: message }, { status })
    }
}
