import React from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from"./IngredientsList"

export default function Main() {
   
   const [recipeShown,setRecipeShown]=React.useState(false)
 const [ingredients,addIngredients]=React.useState(["all the main spices", "pasta", "ground beef", "tomato paste"])

  
    function showRecipe(){
        setRecipeShown(()=>prevRecipe=>!prevRecipe)
    }
   
    function AddIngredient(formData){
        const newIngerdient= formData.get("ingredient")
        addIngredients(preIngredients=>[...preIngredients,newIngerdient])
        
    }
    return(
      <main >
        <form className="add-ingredient-form" action={AddIngredient}>
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
         {ingredients.length>0 && <IngredientsList  ingredients={ingredients} showRecipe={showRecipe} />}

{ recipeShown && <ClaudeRecipe/>
}
      </main>
      
    )
}