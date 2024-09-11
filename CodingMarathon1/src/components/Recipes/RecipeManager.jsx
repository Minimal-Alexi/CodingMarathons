import React, { useState } from "react";
import './Recipe.css';
import Recipe from './Recipe';

function RecipeManager() {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: "", ingredients: "", instructions: "" });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewRecipe((prevRecipe) => ({ ...prevRecipe, [name]: value }));
  }

  function addRecipe() {
    if (newRecipe.name.trim() !== "" && newRecipe.ingredients.trim() !== "") {
      setRecipes((r) => [...r, newRecipe]);
      setNewRecipe({ name: "", ingredients: "", instructions: "" });
    }
  }

  function deleteRecipe(index) {
    const updatedRecipes = recipes.filter((recipe, i) => i !== index);
    setRecipes(updatedRecipes);
  }

  return (
    <div className="recipe-manager">
      <h1>Recipe Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Enter recipe name..."
          name="name"
          value={newRecipe.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Enter ingredients separated by ,"
          name="ingredients"
          value={newRecipe.ingredients}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Enter instructions separated by ,"
          name="instructions"
          value={newRecipe.instructions}
          onChange={handleInputChange}
        />
        <button onClick={addRecipe}>Add Recipe</button>
      </div>
      <div className="section-center featured-center">
        <h2>Available Recipes</h2>
        {recipes.map((recipe, index) => {

          return (
            <Recipe
              item={recipe}
              id={index}
              key={index}
              onDelete={deleteRecipe}
            />
          );
        })}
      </div>
    </div>
  );
}

export default RecipeManager;