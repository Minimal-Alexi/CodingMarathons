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

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const jobFetching = async () => {
    try {
      const response = await fetch("/api/jobs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        //console.log(jobs);
      }
    } catch (error) {
      console.error(error);
      console.error("Failed to fetch jobs");
    }
  };

  const jobFetchingbyID = async (_id) => {
    try {
      const response = await fetch(`/api/jobs/${_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Succesfully found job.");
        return data;
      }
    } catch (error) {
      console.error(error);
      console.error("Failed to fetch job");
      return false;
    }
  };

  const handleDelete = async (_id) => {
    try {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(`/api/jobs/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.ok) {
        jobFetching();
        console.log("Succesfully deleted job.");
      }
    } catch (error) {
      console.error(error);
      console.error("Failed to delete job");
    }
  };

  useEffect(() => {
    jobFetching();
  }, [jobs]);

  return (
    <jobContext.Provider
      value={{ jobs, setJobs, jobFetching, handleDelete, jobFetchingbyID }}
    >
      {children}
    </jobContext.Provider>
  );
};
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

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}
```

Basic Structure: The code provides a simple yet effective way to handle authentication state and token management. It uses React's useState and useEffect hooks well.
Local Storage Integration: The token is stored in localStorage, allowing for persistent authentication across page reloads. This is an important feature for authentication in client-side applications.
Loading State: Including isLoading is a great way to handle scenarios where the app is still determining whether a user is authenticated, such as during the initial render when checking localStorage.

```js
///useField
const useField = (type, value, setValue) => {
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
        name: "George_Giorcescu",
        username: "Georginelfutanel",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Female",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address: "Aleea pieni",
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
        name: "George_Giorcescu",
        username: "Georginelfutanel",
        password: "invalidpassword",
        gender: "Female",
        phone_number: "1234567890",
        date_of_birth: "1990-01-01",
        membership_status: "Active",
        address: "Aleea pieni",
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
        address: "Aleea pieni",
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

---------------------------------------------------------------------------------------------------------------------------

### Backend-no-auth

Loc Dang

##### users API test

```js
// Users API test

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");

beforeAll(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should signup a new user with valid credentials", async () => {
      // Arrange
      const userData1 = {
        name: "Rami",
        username: "test@example.com",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Male",
        date_of_birth: "1999-01-01",
        membership_status: "Active",
        address: "rest",
        profile_picture: "test",
      };

      const userData = {
        name: "Test22222",
        username: "test@example.com",
        password: "R3g5T7#gh",
        phone_number: "09-123-47890",
        gender: "Female",
        date_of_birth: "1999-01-01",
        membership_status: "Inactive",
        address: "test2222",
        profile_picture: "test",
      };

      // Act
      const result = await api.post("/api/users/signup").send(userData);

      console.log(result.body.token);

      // Assert
      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login a user with valid credentials", async () => {
      // Arrange
      const userData = {
        username: "test@example.com",
        password: "R3g5T7#gh",
      };

      // Act
      const result = await api.post("/api/users/login").send(userData);

      // Assert
      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
```

(ChatGPT)Potential Improvements:

- Duplicate Username Issue:
  - You're trying to sign up two users (userData1 and userData) with the same username (test@example.com). The second signup will likely fail due to the unique constraint on the username field (if it exists in your schema).
  - Fix: Either test the first user signup or ensure you use unique usernames for each test case.

```js
const userData = {
  username: "test2222@example.com", // Different email to avoid conflict
  ...
};
```

- Test Separation:
  - The first test is for the signup route, and the second is for login. However, the login test relies on a user already existing in the database. If the signup route test fails, the login test could also fail.
  - Solution: Consider using beforeEach or seeding the database with a user for the login test. This ensures each test is isolated and independent.

```js
beforeEach(async () => {
  await User.create({
    name: "TestUser",
    username: "login@example.com",
    password: "hashedPassword",
    phone_number: "09-123-47890",
    gender: "Female",
    date_of_birth: "1999-01-01",
    membership_status: "Active",
    address: "test address",
    profile_picture: "test picture",
  });
});
```

- Test Cleanup:
  - The afterAll(() => { mongoose.connection.close(); }) closes the database connection, which is good practice. However, you may want to add await to ensure it waits for the operation to complete:

```js
afterAll(async () => {
  await mongoose.connection.close();
});
```

##### jobs API test

```js
// jobs API test

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app
const api = supertest(app);
const Job = require("../models/jobModel");

const jobs = [
  {
    title: "test@test",
    type: "Full-Time",
    description: "test@test",
    company: {
      name: "test@test",
      contactEmail: "test@test",
      contactPhone: "test@test",
    },
    location: "test",
    salary: "090956",
    postedDate: "10/09/2020",
    status: "open",
  },
  {
    title: "test2@test",
    type: "Part-Time",
    description: "test2@test",
    company: {
      name: "test2@test",
      contactEmail: "test2@test",
      contactPhone: "test2@test",
    },
    location: "test999",
    salary: "3423423490956",
    postedDate: "08/09/2020",
    status: "open",
  },
];

describe("Job Controller", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Job.insertMany(jobs);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  // Test GET /api/jobs
  it("should return all jobs as JSON when Get /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  // Test POST /api/jobs

  it("should create new job when POST /api/jobs", async () => {
    const newJob = {
      title: "test3@test",
      type: "Part-Time",
      description: "test3@test",
      company: {
        name: "test3@test",
        contactEmail: "test3@test",
        contactPhone: "test3@test",
      },
      location: "test090909090",
      salary: "90956",
      postedDate: "01/09/2020",
      status: "open",
    };
    await api
      .post("/api/jobs")
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
    const jobNames = jobsAfterPost.map((job) => job.name);
    expect(jobNames).toContain(newJob.name);
  });

  // Test GET /api/jobs/:id
  it("should return one job by ID when GET /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });

  // Test PUT /api/jobs/:id
  it("should update one job with partial data when PUT /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    const updatedJob = {
      title: "Updated title",
      description: "Updated description",
    };

    await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.title).toBe(updatedJob.title);
    expect(updatedJobCheck.description).toBe(updatedJob.description);
  });

  it("should return 400 for invalid job ID when PUT /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });

  // Test DELETE /api/jobs/:id
  it("should delete one job by ID when DELETE /api/jobs/:id is called", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID when DELETE /api/jobs/:id", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});
```

(ChatGPT)Potential Improvements:

- Job Name Check in POST Test:
- In the POST test, you are checking if the new job’s name is included in the job list, but in your job schema, there doesn't appear to be a name field at the root level (it's nested inside the company field).
- Fix: Update the check to look for the title field instead:

```js
const jobTitles = jobsAfterPost.map((job) => job.title);
expect(jobTitles).toContain(newJob.title);
```

- postedDate Format:
  - You're using a string format ("10/09/2020") for postedDate. If postedDate is supposed to represent an actual date (in MongoDB's Date format), you should change this to a Date object to ensure consistency with date handling in MongoDB.
  - Fix: Update the postedDate field to:

```js
postedDate: new Date("2020-09-10"),
```

- Test Cleanup:
  - While the afterAll function is closing the MongoDB connection, it’s safer to make it asynchronous with await. This ensures the test waits until the connection is completely closed:

```js
afterAll(async () => {
  await mongoose.connection.close();
});
```

##### users model

```js
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Full-time, Part-time, Contract
  description: { type: String, required: true },
  company: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },
  location: { type: String, required: true }, // e.g., City, State, or Remote
  salary: { type: Number, required: true }, // e.g., Annual or hourly salary
  postedDate: { type: Date, default: Date.now }, // Date the job was posted
  status: { type: String, enum: ["open", "closed"], default: "open" }, // Job status (open/closed)
});
```

-(ChatGPT)Potential improvements:

- Job Type Enum:
- You may want to consider using an enum for the type field (e.g., Full-time, Part-time, Contract) to ensure valid job types are being entered:

```js
type: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], required: true }
```

- Validation on Email:

  - It may be a good idea to add basic email validation on the contactEmail field to ensure valid email addresses are provided:

  ```js
  contactEmail: {
  type: String,
  required: true,
  match: [/\S+@\S+\.\S+/, 'is invalid'] // Basic email validation
  }

  ```

#### userControllers.js

```js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    username,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    address,
    profile_picture,
  } = req.body;
  try {
    if (
      !name ||
      !username ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status ||
      !address ||
      !profile_picture
    ) {
      res.status(400);
      throw new Error("Please add all fields");
    }
    // Check if user exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      address,
      profile_picture,
    });

    if (user) {
      // console.log(user._id);
      const token = generateToken(user._id);
      res.status(201).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check for user username
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);
      res.status(200).json({ username, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
// const getMe = async (req, res) => {
//   try {
//     res.status(200).json(req.user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

module.exports = {
  signupUser,
  loginUser,
};
```

-(ChatGPT)Potential improvements:

- Detailed Error Handling:
- Instead of using res.status(400) and throw new Error() directly, it might be better to standardize the error-handling process by creating a middleware that formats errors consistently across the application.

```js
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
app.use(errorHandler);
```
---------------------------------------------------------------------------------------------------------------------------

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
