import React from "react"

const Recipe = ({ item,id, onDelete }) => {
    const handleDelete = () => {
        onDelete(id); // Pass the item's ID to the parent component for deletion
      };

    const itemLister = (list) => 
        {
            const items = list.split(",");
            return items.map((item, index) => (
                <li key={index}>{item.trim()}</li>
            ));
        }

    return(
    <article className="Recipe-Card">
        <div className="Recipe-Info">
            <div className="Recipe-Title">
                <h3>{item.name}</h3>
            </div>
            <div className="Preparation-Instructions">
                <h4>Ingredients</h4>
                <ul>
                    {itemLister(item.ingredients)}
                </ul>
                <h4>Instructions</h4>
                <ul>
                    {itemLister(item.instructions)}
                </ul>
            </div>
        </div>
        <button onClick={handleDelete}>Delete Recipe</button>
    </article>
    )
}

export default Recipe;