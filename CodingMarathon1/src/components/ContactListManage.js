import React, { useState } from "react";
import "./ContactListManage.css";
import Contact from "./Contact.js";

function ContactListManager() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    console.log(event.target);
    setNewContact((prevContact) => ({ ...prevContact, [name]: value }));
  }

  function addContact() {
    if (
      newContact.name.trim() !== "" &&
      newContact.email.trim() !== "" &&
      newContact.phone.trim() !== ""
    ) {
      setContacts((c) => [...c, newContact]);
      setNewContact({ name: "", email: "", phone: "" });
    }
  }

  function deleteContact(index) {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
  }

  return (
    <div className="contact-list">
      <h1>Contact List Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Enter name..."
          name="name"
          value={newContact.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          placeholder="Enter email..."
          name="email"
          value={newContact.email}
          onChange={handleInputChange}
        />
        <input
          type="phone"
          placeholder="Enter phone number..."
          name="phone"
          value={newContact.phone}
          onChange={handleInputChange}
        />
        <button onClick={addContact}>Add Contact</button>
      </div>
      <ol>
        {contacts.map((contact, index) => {
          return <Contact {...contact} key={index} onDelete={deleteContact} />;
        })}
      </ol>
    </div>
  );
}

export default ContactListManager;
