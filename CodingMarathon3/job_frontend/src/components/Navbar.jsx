import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar">
      <h1>Job Search</h1>
      <div className="links">
        <Link to={`/`}>Home</Link>
        {isAuthenticated ? (
          <>
            <Link to={`/add-job`}>Add job</Link>
          </>
        ) : (
          <>
            <Link to={`/signup`}>Sign up</Link>
            <Link to={`/login`}>Log in</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;