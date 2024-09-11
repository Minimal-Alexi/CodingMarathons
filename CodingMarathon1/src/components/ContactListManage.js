import React, { useState } from "react";
import "./ContactListManage.css";

function ContactListManager() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    console.log(event.target)
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
        {contacts.map((contact, index) => (
          <li key={index}>
            <div className="contact-display">
              <p><strong>Name: </strong> {contact.name}</p>
              <p><strong>Email: </strong> {contact.email}</p>
              <p><strong>Phone Number: </strong>{contact.phone}</p>
            </div>
            <button onClick={() => deleteContact(index)}>Delete</button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ContactListManager;
