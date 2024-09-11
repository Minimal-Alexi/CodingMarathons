import React, { useState } from "react";
import Book from './Book';


function BookCollectionManager() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());

  // Handle input change for title
  function handleTitleChange(event) {
    setTitle(event.target.value);
  }

  // Handle input change for author
  function handleAuthorChange(event) {
    setAuthor(event.target.value);
  }

    // Handle input change for year
    function handleYearChange(event) {
        setYear(event.target.value);
      }

  // Add a new book to the list
  function addBook() {
    if (title.trim() !== "" && author.trim() !== "") {
      setBooks((b) => [...b, { title, author, year }]);
    // Clear the input fields
      setTitle("");
      setAuthor(""); 
      setYear(new Date().getFullYear());
    }
  }

  // Delete a book from the list
  function deleteBook(index) {
    const updatedBooks = books.filter((_, i) => i !== index);
    setBooks(updatedBooks);
  }

  return (
    <div className="book-collection">
      <h1>Book Collection Manager</h1>
      <div>
        <input
          type="text"
          placeholder="Enter book title..."
          value={title}
          onChange={handleTitleChange}
        />
        <input
          type="text"
          placeholder="Enter author name..."
          value={author}
          onChange={handleAuthorChange}
        />
        <input type="number" value={year} onChange={handleYearChange}/>
        <button onClick={addBook}>Add Book</button>
      </div>
      <ol>
        {books.map((book, index) => (
          <Book
          key={index}
          title={book.title}
          author={book.author}
          year={book.year}
          isDelete={() => deleteBook(index)}
        />
        ))}
      </ol>
    </div>
  );
}

export default BookCollectionManager;


