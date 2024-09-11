import React from "react"

const Recipe = ({ item, onDelete }) => {
    const handleDelete = () => {
        onDelete(item.id); // Pass the item's ID to the parent component for deletion
      };

    return(
    <article className="Recipe-Card">
        <div className="Recipe-Info">
            <div className="Recipe-Title">
                <h2>{item.name}</h2>
            </div>
            <div className="Preparation-Instructions">
                <h3>Ingredients</h3>
                <p>{item.ingredients}</p>
                <h3>Instructions</h3>
                <p>{item.instructions}</p>
            </div>
        </div>
        <button onClick={handleDelete}>Delete Recipe</button>
    </article>
    )
}

export default Recipe;