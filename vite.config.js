import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { createRecipe, RecipeError } from "./server/createRecipe.js"

function recipeApi(token) {
    const handle = (req, res, next) => {
        const url = req.url?.split("?")[0]
        if (url !== "/api/recipe") {
            next()
            return
        }
        if (req.method !== "POST") {
            res.statusCode = 405
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({ error: "Method not allowed" }))
            return
        }

        const chunks = []
        req.on("data", (chunk) => chunks.push(chunk))
        req.on("end", async () => {
            try {
                let body
                try {
                    body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}")
                } catch {
                    res.statusCode = 400
                    res.setHeader("Content-Type", "application/json")
                    res.end(JSON.stringify({ error: "Invalid request." }))
                    return
                }
                const recipe = await createRecipe(body?.ingredients, token)
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({ recipe }))
            } catch (err) {
                const status = err instanceof RecipeError ? err.status : 500
                const message = err instanceof Error && err.message ? err.message : "Could not get a recipe."
                res.statusCode = status
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({ error: message }))
            }
        })
    }

    return {
        name: "recipe-api",
        configureServer(server) {
            server.middlewares.use(handle)
        },
        configurePreviewServer(server) {
            server.middlewares.use(handle)
        },
    }
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "")
    const token = env.HF_TOKEN || env.VITE_HF_TOKEN || ""

    return {
        plugins: [react(), recipeApi(token)],
    }
})
