function Book({ title, author, year, isDelete }) {
    return (
      <li>
        {title} ({year}) by {author}
        <button onClick={isDelete}>Delete</button>
      </li>
    );
  }
  
  export default Book;