import React from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromIngredients } from "../ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [error, setError] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    async function getRecipe() {
        if (isLoading) return
        setIsLoading(true)
        setError("")
        try {
            const nextRecipe = await getRecipeFromIngredients(ingredients)
            setRecipe(nextRecipe)
        } catch (err) {
            setRecipe("")
            setError(err.message || "Could not get a recipe.")
        } finally {
            setIsLoading(false)
        }
    }

    const showRecipe = isLoading || recipe || error

    return (
        <main>
            <form className="add-ingredient-form" action={addIngredient}>
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            {ingredients.length > 0 && (
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                />
            )}
            {showRecipe && (
                <ClaudeRecipe recipe={recipe} error={error} isLoading={isLoading} />
            )}
        </main>
    )
}
