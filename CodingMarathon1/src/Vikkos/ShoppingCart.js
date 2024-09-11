import React, { useState } from "react";
import Item from "../components/Item";
import './ShoppingCart.css';

function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: "", quantity

      : ""
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  }

  function addItem() {
    if (newItem.itemName.trim() !== "" && newItem.quantity.trim() !== "") {
      setItems((i) => [...i, newItem]);
      setNewItem({ itemName: "", quantity: "" });
    }
  }

  function deleteItem(index) {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  }

  return (
    <div className="shopping-cart">
      <h1>Shopping Cart</h1>
      <div className="input-fields">
        <input
          type="text"
          placeholder="Enter item name..."
          name="itemName"
          value={newItem.itemName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Enter quantity..."
          name="quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ol>
        {items.map((item, index) => (
          <Item key={index} item={item} index={index} deleteItem={deleteItem} />
        ))}
      </ol>
    </div>
  );
}

export default ShoppingCart;