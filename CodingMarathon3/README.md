# Coding Marathon 3

- **Group 9:**
- **Link to the backend repositories:**
  - [Backend repo for API V1](https://github.com/Minimal-Alexi/CodingMarathons/tree/main/CodingMarathon3/Job_Backend/backend-no-auth)
  - [Backend repo for API V2](https://github.com/Minimal-Alexi/CodingMarathons/tree/main/CodingMarathon3/Job_Backend/backend-auth)
- **Link to the frontend repository:**
  - [Frontend repo](https://github.com/Minimal-Alexi/CodingMarathons/tree/main/CodingMarathon3/job_frontend)
- **URLs for the deployed APIs:**
  - [URL for API V1](https://without-auth-work.onrender.com)
  - [URL for API V2](https://auth-work.onrender.com/)

---

## Self-Assessment of Code

### Frontend

Pop Alex

```js
/// job context
import { createContext, useState, useEffect } from "react";

export const jobContext = createContext();

export const JobProvider  = ({ children }) => {
    const [jobs, setJobs] = useState([]);

    const jobFetching = async () => {
      try {
        const response = await fetch('/api/jobs',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          },)
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
          //console.log(jobs);
        }
  
      }
      catch (error) {
        console.error(error);
        console.error('Failed to fetch jobs');
      }
    }

    
    const jobFetchingbyID = async (_id) => {   
        try {
            const response = await fetch(`/api/jobs/${_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Succesfully found job.")
                return data;
            }
        } catch (error) {
            console.error(error);
            console.error('Failed to fetch job')
            return false;
        }
    }
    
    const handleDelete = async (_id) => {
        try
        {
          const jwt = localStorage.getItem("jwt");
          const response = await fetch(`/api/jobs/${_id}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
              }
            },)
            if(response.ok)
              {
                jobFetching();
                console.log("Succesfully deleted job.");
              }
        }catch (error) {
          console.error(error);
          console.error('Failed to delete job');
        }
      }

    useEffect(() => {
      jobFetching();
    }, [jobs])

    return (
        <jobContext.Provider value={{ jobs, setJobs, jobFetching, handleDelete, jobFetchingbyID}}>
            {children}
        </jobContext.Provider>
    );
}
```
Modular Design: The code is well-organized with clearly defined functions for fetching jobs, fetching by ID, and deleting jobs. This separation of concerns makes the logic more maintainable and reusable.
Use of Context: Using React’s Context API to share state and functions like jobs, jobFetching, handleDelete, and jobFetchingbyID across the component tree is appropriate for managing state globally.

Problem: The context is exported as jobContext, but typically in React, context names are PascalCase (i.e., JobContext).

Solution: Rename jobContext to JobContext to follow common naming conventions.
```js
///Auth context
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setIsLoggedIn(true);
      setToken(storedJwt);
    }
    setIsLoading(false);
  }, []);

  function login(token) {
    setIsLoggedIn(true);
    setToken(token);
    localStorage.setItem("jwt", token);
  }

  function logout() {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("jwt");
  }

  const authValue = {
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
```
Basic Structure: The code provides a simple yet effective way to handle authentication state and token management. It uses React's useState and useEffect hooks well.
Local Storage Integration: The token is stored in localStorage, allowing for persistent authentication across page reloads. This is an important feature for authentication in client-side applications.
Loading State: Including isLoading is a great way to handle scenarios where the app is still determining whether a user is authenticated, such as during the initial render when checking localStorage.


```js
///useField
const useField = (type,value,setValue) => {

  const onChange = (event) => setValue(event.target.value);

  return {
    type,
    value,
    onChange,
  };
};

export default useField;


```
Simplicity: The hook is very straightforward. It abstracts the common logic for handling input fields, making form handling easier and reducing boilerplate in components.
Reusability: The hook is reusable across different types of input fields, since it accepts type, value, and setValue as parameters.

### Backend

Pop Alex

User Testing
```js
///usertest
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");


/*
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  membership_status: { type: String, required: true },
  address: { type: String, required: true },
  profile_picture: { type: String, required: false }
*/

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData = {
        name:"George_Giorcescu",
        username: "Georginelfutanel",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender:"Female",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address:"Aleea pieni"
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        name:"George_Giorcescu",
        username: "Georginelfutanel",
        password: "invalidpassword",
        gender:"Female",
        phone_number: "1234567890",
        date_of_birth: "1990-01-01",
        membership_status: "Active",
        address:"Aleea pieni"
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
    it("should return an error when username already exists", async () => {
      // Arrange
      const userData = {
        name: "George_Giorcescu",
        username: "Georginelfutanel",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Female",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address: "Aleea pieni"
      };
    
      // Act
      await api.post("/api/users/signup").send(userData);
      const result = await api.post("/api/users/signup").send(userData);
    
      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

  });

  describe("POST /api/users/login", () => {
    it("should login a user with valid credentials", async () => {
      // Arrange
      const userData = {
        username: "Georginelfutanel",
        password: "R3g5T7#gh",
      };

      // Act
      const result = await api.post("/api/users/login").send(userData);

      // Assert
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
    });

    it("should return an error with invalid credentials", async () => {
      // Arrange
      const userData = {
        username: "Georginelfutanel",
        password: "invalidpassword",
      };

      // Act
      const result = await api.post("/api/users/login").send(userData);

      // Assert
      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});

```
(GPT)
Clear Structure: The code is well-structured with tests neatly organized into describe blocks for each route and it blocks for each scenario.
Test Coverage: The tests cover both valid and invalid cases for signup and login, ensuring that both successful operations and error cases are tested.
Isolation:

    The beforeAll function deletes all users from the database before running the tests. This ensures that the tests run in isolation and don't interfere with each other or with leftover data from previous test runs.
    afterAll ensures that the database connection is closed after all tests complete, preventing resource leaks.

Realistic Data: Test data provided (e.g., usernames, passwords) appears realistic and follows typical patterns for a signup process.

# Thien Luu

### With the new schemas for users and jobs. My part was to create the deployment of the app with out authentication. Since we want to keep the user login and signup functions, we just edit the code so that no user account is needed to add, edit and delete jobs.

```js
// app.js
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });
  

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage/>} />
            <Route
              path="/jobs/add-job"
              element={<AddJobPage />}
            />           
            <Route
              path="/edit-job/:id"
              element={<EditJobPage />}
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Signup setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
```
ChatGPT assessment:
Strengths:
Clear Structure:

The application structure is clear, with routes well-defined for different pages (Home, JobPage, AddJobPage, etc.).
The code follows the best practice of separating concerns by defining components for navigation (Navbar) and each route page.
Authentication Handling:

Authentication state (isAuthenticated) is managed through useState, with an initial value fetched from localStorage. This allows the app to persist the user’s login session across refreshes.
Routes for signup and login conditionally redirect authenticated users to the home page, which is a good UX practice.
Conditional Navigation:

Proper usage of Navigate to handle redirecting users when they try to access login or signup pages while already authenticated. This prevents logged-in users from accessing these pages unnecessarily.
404 Handling:

A Route is set up to handle undefined paths with a NotFoundPage, which improves the overall user experience by handling broken or undefined routes gracefully.

Suggestions:
Loading and Error States:

Consider adding loading and error states when interacting with the authentication system, especially when making asynchronous requests (e.g., logging in or signing up).
UI Feedback:

Provide feedback to users during transitions, such as a loading spinner or an alert if they’re redirected from a protected route.

### The navbar is dynamic: will change after logged in but all other jobs related options is available without authentication

```js
// Navbar
const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = (e) => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>React Jobs</h1>
      </Link>
      <div className="links">
        {isAuthenticated && (
          <div>
            <Link to="/jobs/add-job">Add Job</Link>
            <span>{JSON.parse(localStorage.getItem("user")).username}</span>
            <button onClick={handleClick}>Log out</button>
          </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/jobs/add-job">Add Job</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

ChatGPT assessment:
The Navbar component you've written provides a clear navigation UI with appropriate links for authenticated and unauthenticated users. It handles logouts and switches between states smoothly. However, there are a few improvements and optimizations that can be made to improve its functionality, security, and overall performance.

Strengths:
Conditional Rendering:
The component handles conditional rendering based on the isAuthenticated state. It shows appropriate links for authenticated and unauthenticated users.
Logout Functionality:
The logout functionality is handled well by removing the user from localStorage and setting the authentication state to false.

Suggestions:
The Navbar component works well, but can benefit from a few optimizations:
 - Avoid directly accessing localStorage in JSX.
 - Handle user data in a more secure and efficient way.
 - Improve code readability and reduce redundancy in links. (this redundancy is intended)
 - Redirect users after logging out.

### Other work including hooks: useLogin, useSignup, useField for overall modularity
```js
// File name or function
// Your code part B
```