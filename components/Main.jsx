import React from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from "./IngredientsList"
import { getRecipeFromIngredients } from "../ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [error, setError] = React.useState("")
    const [formMessage, setFormMessage] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const recipeSection = React.useRef(null)

    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            recipeSection.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [recipe])

    function addIngredient(formData) {
        const newIngredient = String(formData.get("ingredient") || "").trim()
        if (!newIngredient) {
            setFormMessage("Type an ingredient first, then tap Add ingredient.")
            return
        }
        const alreadyAdded = ingredients.some(ingredient => ingredient.toLowerCase() === newIngredient.toLowerCase())
        if (alreadyAdded) {
            setFormMessage("That ingredient is already on your list.")
            return
        }
        setFormMessage("")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    function removeIngredient(ingredient) {
        setIngredients(prevIngredients => prevIngredients.filter(item => item !== ingredient))
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

    function startOver() {
        setIngredients([])
        setRecipe("")
        setError("")
        setFormMessage("")
        setIsLoading(false)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const showRecipe = isLoading || recipe || error
    const currentStep = ingredients.length === 0 ? 1 : ingredients.length < 4 ? 2 : 3

    return (
        <main>
            {!recipe && (
                <section className="how-to" aria-label="How to use Chef Claude">
                    <p>Chef Claude writes a recipe from food you already have. The list starts empty, so add your own ingredients.</p>
                    <ol>
                        <li className={currentStep === 1 ? "is-current" : "is-done"}>Type one ingredient and tap Add ingredient.</li>
                        <li className={currentStep === 2 ? "is-current" : currentStep > 2 ? "is-done" : ""}>Add at least 4 ingredients.</li>
                        <li className={currentStep === 3 ? "is-current" : ""}>Tap Get a recipe.</li>
                    </ol>
                </section>
            )}
            <form className="ingredient-form" action={addIngredient}>
                <label htmlFor="ingredient">Add an ingredient you have</label>
                <div className="add-ingredient-form">
                    <input
                        id="ingredient"
                        type="text"
                        placeholder="e.g. chicken, rice, tomato"
                        aria-label="Add ingredient"
                        name="ingredient"
                    />
                    <button>Add ingredient</button>
                </div>
                {formMessage && <p className="form-message" role="status">{formMessage}</p>}
            </form>
            {ingredients.length > 0 && (
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                    onRemove={removeIngredient}
                />
            )}
            {showRecipe && (
                <ClaudeRecipe
                    ref={recipeSection}
                    recipe={recipe}
                    error={error}
                    isLoading={isLoading}
                    onStartOver={startOver}
                />
            )}
        </main>
    )
}
