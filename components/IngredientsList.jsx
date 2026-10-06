export default function IngredientsList(props) {
    const remaining = 4 - props.ingredients.length
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>
            <span>{ingredient}</span>
            <button type="button" className="remove-ingredient" onClick={() => props.onRemove(ingredient)}>
                Remove
            </button>
        </li>
    ))
    return (
        <section>
            <h2>Your ingredients</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {remaining > 0 && (
                <p className="ingredient-hint">
                    Add {remaining} more ingredient{remaining === 1 ? "" : "s"}. The recipe button appears when you have 4.
                </p>
            )}
            {props.ingredients.length > 3 && (
                <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p>You have enough ingredients. Chef Claude will suggest something you can cook.</p>
                    </div>
                    <button type="button" onClick={props.getRecipe} disabled={props.isLoading}>
                        {props.isLoading ? "Getting recipe..." : "Get a recipe"}
                    </button>
                </div>
            )}
        </section>
    )
}
