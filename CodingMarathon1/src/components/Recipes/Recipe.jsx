import React from "react"

const Recipe = ({ item,id, onDelete }) => {
    const handleDelete = () => {
        onDelete(id); // Pass the item's ID to the parent component for deletion
      };

    return(
    <article className="Recipe-Card">
        <div className="Recipe-Info">
            <div className="Recipe-Title">
                <h3>{item.name}</h3>
            </div>
            <div className="Preparation-Instructions">
                <h4>Ingredients</h4>
                <p>{item.ingredients}</p>
                <h4>Instructions</h4>
                <p>{item.instructions}</p>
            </div>
        </div>
        <button onClick={handleDelete}>Delete Recipe</button>
    </article>
    )
}

export default Recipe;