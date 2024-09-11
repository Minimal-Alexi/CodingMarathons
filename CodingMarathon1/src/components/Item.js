import React, { useState } from "react";
import '../Vikkos/ShoppingCart.css';

const Item = ({ item, index, deleteItem }) => {
    return (
        <li className="listing">
            {item.itemName} - {item.quantity}
            <button className="delete-button" onClick={() => deleteItem(index)}>Delete</button>
        </li>
    )
};

export default Item;