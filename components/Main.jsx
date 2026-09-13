export default function Main() {
    const ingredients=["Chicken", "Oregano", "Tomatoes"]
   
     
    const ingredientsListItems = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))
   
    function Submit(e){
        e.preventDefault()
        console.log("sumbitted")
        const formData= new FormData(e.currentTarget)
        const newIngerdient= formData.get("ingredient")
        ingredients.push(newIngerdient)
        console.log(ingredients)
    }
    return(
      <main >
        <form className="add-ingredient-form" onSubmit={Submit}>
            <input 
            type="text"
            placeholder="e.g. oregano"
            aria-label="Add ingredient"
            name="ingredient"
            />
            <button >
                Add ingredient
            </button>
        </form>
          <ul>
          {ingredientsListItems}
            </ul>

      </main>
      
    )
}