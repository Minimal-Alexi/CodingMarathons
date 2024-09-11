function Contact({ ...data }) {
  const handleDelete = () => {
    data.onDelete(data.index);
  };
  // console.log(data)

  return (
    <li key={data.index}>
      <div className="contact-display">
        <p>
          <strong>Name: </strong> {data.name}
        </p>
        <p>
          <strong>Email: </strong> {data.email}
        </p>
        <p>
          <strong>Phone Number: </strong>
          {data.phone}
        </p>
      </div>
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default Contact;
