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

# Vikko Veikkolainen

## Frontend

```js
// Login.jsx

import { useState } from "react";
import useLogin from "../hooks/useLogin";
import useField from '../hooks/useField';
import { useNavigate } from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const usernameField = useField("text", username, setUsername);
    const passwordField = useField("password", password, setPassword);

    const { login, error } = useLogin("/api/users/login")

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await login({
            username: username,
            password: password,
        });
        if (!error) {
            console.log("success");
            navigate("/");
        }
    }

    return (
        <div className="login">
            <h2>Log in</h2>
            <form onSubmit={handleFormSubmit}>
                <label>username:</label>
                <input {...usernameField} />
                <label>Password:</label>
                <input {...passwordField} />
                <button>Log in</button>
            </form>
        </div>
    )
};

export default Login;
```

ChatGPT assessment:

Overall review:
  The code provided is a functional login component built using React and the react-router-dom library for navigation. It utilizes custom hooks (useLogin and useField) to manage form state and login logic, and implements a clean and concise way of handling form submission and user authentication. The structure is clear, and the separation of concerns through custom hooks makes the code reusable and maintainable. However, there are areas that could be improved in terms of error handling, UX, and code optimization.

Strengths:
  Custom Hook Usage: The use of useField for managing form fields is a good example of modular and reusable code. By abstracting field behavior into a hook, you've made the form fields generic and reusable for other forms in the application. Similarly, useLogin encapsulates the login logic, promoting separation of concerns.

  Clean and Readable Code: The component follows a clear and readable structure. Variable names are intuitive, making it easy for other developers to understand the code at a glance.

  Form Handling: The form submission logic is straightforward and avoids unnecessary complexity. The asynchronous nature of the login process is handled well with async/await.

  Navigation Post-Login: After a successful login, the use of useNavigate to redirect users to the home page is a standard and effective approach to guide users.


Weaknesses:
  Error Handling: While the component captures the error object from useLogin, there is no logic in place to display error messages or feedback to the user if login fails. This can lead to a poor user experience as users won't know why their login attempt failed.

  Form Validation: The current form does not have any validation logic for the username and password fields. A user can submit the form with empty fields, which could lead to errors during the login request.

  No Loading State: The code does not handle a "loading" state during the async login process. Without visual feedback, the user may try to resubmit the form or navigate away while the request is still being processed, leading to confusion.

  Potential Redundant State Management: The useState hooks for username and password in combination with useField may be redundant. Since useField already manages the state internally, you might not need to separately define useState for each field.

  Inconsistent Naming: While usernameField and passwordField are descriptive, naming can sometimes be confusing because they represent more than just the field—they encapsulate the entire field's props. A more intuitive name, like usernameProps or passwordProps, could make it clearer that these spread the input properties.


Improvements:
  Add Error Feedback: Implement logic to display error messages to the user when login fails. For example, show a message below the form indicating what went wrong (e.g., "Invalid username or password"). This improves the user experience and helps users correct their input.

  Form Validation: Introduce basic form validation to ensure that the username and password fields are not empty before the form is submitted. Optionally, you could add more advanced validation rules, such as minimum length for the password or username format.

  Loading Indicator: Add a loading state during the login process to prevent multiple submissions and indicate to the user that the request is being processed. This could be a simple "Loading..." message or a spinner next to the submit button.

  Remove Redundant State: Since useField manages the value and setValue internally, you could consider removing the explicit useState hooks for username and password, further simplifying the code.

  Improve Error Handling Logic: If login throws an error (e.g., network failure), make sure it's handled properly within handleFormSubmit. You can also reset the error state when the user changes the input to allow for another attempt without the error message persisting.

  Consider Disabled Button: Disable the "Log in" button when the form is incomplete or during the login request to prevent repeated submissions or incorrect inputs.


```js
// Signup.jsx

import { useState } from "react";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import useField from '../hooks/useField';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  const nameField = useField("text", name, setName);
  const usernameField = useField("username", username, setUsername);
  const passwordField = useField("password", password, setPassword);
  const phoneNumberField = useField("text", phoneNumber, setPhoneNumber);
  const genderField = useField("text", gender, setGender);
  const dateOfBirthField = useField("date", dateOfBirth, setDateOfBirth);
  const membershipStatusField = useField("text", membershipStatus, setMembershipStatus);
  const addressField = useField("address", address, setAddress);
  const profilePictureField = useField("text", profilePicture, setProfilePicture);

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      name: name,
      username: username,
      password: password,
      phone_number: phoneNumber,
      gender: gender,
      date_of_birth: dateOfBirth,
      membership_status: membershipStatus,
      address: address,
      profile_picture: profilePicture
    });
    if (!error) {
      console.log("success");
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...nameField} />
        <label>Usename:</label>
        <input {...usernameField} />
        <label>Password:</label>
        <input {...passwordField} />
        <label>Phone Number:</label>
        <input {...phoneNumberField} />
        <label>Gender:</label>
        <input {...genderField} />
        <label>Date of Birth:</label>
        <input {...dateOfBirthField} />
        <label>Membership Status:</label>
        <input {...membershipStatusField} />
        <label>Address:</label>
        <input {...addressField}/>
        <label>Profile picture:</label>
        <input {...profilePictureField}/>
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
```

ChatGPT assessment:

Overall review:
  The code provided is a React functional component that handles user signup functionality. It uses custom hooks to manage input fields and a signup process. The component is organized and clear in its structure, making use of modular hooks to encapsulate functionality. However, there are several areas for improvement regarding error handling, form validation, and user experience enhancements.


Strengths:
  Modular Code Structure: The component leverages custom hooks (useField and useSignup) to handle form inputs and signup logic, promoting reusability and separation of concerns. This modularity makes the component easier to maintain and extend.

  Clear Variable Naming: The variable names are intuitive and descriptive, allowing other developers to quickly understand the purpose of each state and field. This improves the readability and maintainability of the code.

  Comprehensive User Information: The form collects a wide range of user information (name, username, password, etc.), which can enhance the application's user management capabilities.

  Asynchronous Form Submission: The use of async/await for the signup process is well-implemented. It keeps the code concise and easy to follow.

  Navigation on Success: Upon successful signup, the component navigates users to the home page using useNavigate, which is a good practice to enhance user experience.


Weaknesses:
  Lack of Error Handling: Similar to the login component, there is no mechanism to display errors to the user if the signup fails. This can lead to confusion for users who might not understand why their signup attempt was unsuccessful.

  Form Validation: The component does not include validation for the fields. Users can submit the form with empty fields or invalid data, which could cause errors during the signup request. For example, a username could be required to meet specific criteria (length, character type).

  No Loading Indicator: There is no indication of loading or processing after the signup button is clicked. A loading state would inform users that their request is being processed and prevent multiple submissions.

  Redundant State Management: The use of useState hooks for each form field alongside useField may be unnecessary, as useField already encapsulates state management. This leads to increased code complexity without added value.

  Consistent Input Types: For fields like phone number and gender, using text as the input type is not optimal. This could lead to format errors or inconsistencies in user input. Using appropriate input types would improve data validation and user experience.

  Inconsistent Naming for Input Types: The input type for username should be "text" rather than "username" to match standard HTML input types. Additionally, the label for the username field has a typo (“Usename” instead of “Username”), which could confuse users.


Improvements:
  Implement Error Feedback: Enhance user experience by displaying error messages if the signup process fails. This could include feedback such as "Username already taken" or "Please fill out all fields."

  Add Form Validation: Introduce validation logic for each field to ensure users provide the necessary information in the correct format before submission. This can include checks for required fields, maximum lengths, and proper formats for phone numbers.

  Incorporate Loading State: Implement a loading state during the signup process to give users feedback that their request is being processed. This can be done by disabling the submit button and showing a spinner or loading message.

  Remove Redundant State Management: Since useField handles the state internally, consider removing the separate useState hooks for each field. This would simplify the code and reduce redundancy.

  Use Appropriate Input Types: Update the input types for fields like phone number (should be tel) and date of birth (should be date) to improve data validation and enhance user experience.

  Fix Input Type for Username: Change the usernameField input type from "username" to "text" to comply with standard HTML input types. Additionally, correct the label typo from “Usename” to “Username.”

  Consider Disabled Button for Incomplete Forms: Disable the "Sign up" button when the form is incomplete to prevent users from submitting invalid data.

  Add a Confirmation for Successful Signup: Beyond logging success to the console, consider providing user feedback, such as a success message or visual indication of a successful signup.


## Backend

```js
//job.test.js

const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Jobs = require("../models/jobModel");

let token = null;

beforeAll(async () => {
    await Jobs.deleteMany({});
    const result = await api.post("/api/users/signup").send({
        name: "John Doe",
        username: "john@example.com",
        password: "password123",
        phone_number: "1234567890",
        gender: "Male",
        date_of_birth: "1990-01-01",
        membership_status: "Inactive",
        address: "address",
    });
    token = result.body.token;
});

describe("Job API", function () {
    beforeEach(async () => {
        await Jobs.deleteMany({});

        job = {
            title: "John Doe",
            type: "Full-time",
            description: "password123",
            company: {
                name: "name",
                contactEmail: "Male@example.com",
                contactPhone: "19900101",
            },
            location: "Inactive",
            salary: "255423",
        }

        const result = await api
            .post("/api/jobs")
            .send(job)
            .set("Authorization", "bearer " + token)
    });

    describe("GET /jobs", () => {
        it('should return all jobs', async () => {
            await api
                .get("/api/jobs")
                .set("Authorization", "bearer " + token)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        });

        it('should get one job by id', async () => {
            console.log("entered test")

            const job = await Jobs.findOne();

            console.log(job)

            await api
                .get("/api/jobs/" + job._id)
                .set("Authorization", "bearer " + token)
                .expect(200)
                .expect("Content-Type", /application\/json/);
        })
    })

    describe("POST /jobs", () => {
        it('should create a new job', async () => {
            console.log("entered test")

            const newJob = {
                title: "job",
                type: "Full-time",
                description: "description",
                company: {
                    name: "name",
                    contactEmail: "email@email.email",
                    contactPhone: "1234567",
                },
                location: "location",
                salary: 1234567,
            };

            const response = await api
                .post("/api/jobs")
                .set("Authorization", "bearer " + token)
                .send(newJob)
                .expect(201)
                .expect("Content-Type", /application\/json/);
        });
    });

    describe("PUT /jobs", () => {
        it('should update job by id', async () => {
            const job = await Jobs.findOne();
            const updatedJob = {
                type: "Lmao",
                description: "Bad",
            };

            const response = await api
                .put(`/api/jobs/${job._id}`)
                .set("Authorization", "bearer " + token)
                .send(updatedJob)
                .expect(200)
                .expect("Content-Type", /application\/json/);

            console.log("Response body:", response.body);

            const updatedjobCheck = await Jobs.findById(job._id);
            console.log("Updated job:", updatedjobCheck);

            expect(updatedjobCheck.type).toBe(updatedJob.type);
            expect(updatedjobCheck.description).toBe(updatedJob.description);
        })
    })

    describe("Delete /jobs", () => {
        it('should delete job by id', async () => {
            const job = await Jobs.findOne();
            await api
                .delete(`/api/jobs/${job._id}`)
                .set("Authorization", "bearer " + token)
                .expect(204)
            const jobCheck = await Jobs.findById(job._id);
            expect(jobCheck).toBeNull();
        })
    })
})
```

ChatGPT assessment:

Overall review:
  The provided code is a set of automated tests for a job management API using Jest and Supertest. It covers various endpoints, including the creation, retrieval, updating, and deletion of job listings. The tests are well-structured and demonstrate good use of setup and teardown methods to ensure a clean state for each test. However, there are several areas for improvement regarding clarity, error handling, and overall test robustness.


Strenghts:
  Modular Test Structure: The use of describe blocks to organize tests based on API endpoints (GET, POST, PUT, DELETE) makes the code modular and easy to navigate. Each group of tests is clearly defined, improving readability.

  Before Hooks for Setup: The beforeAll and beforeEach hooks are effectively used to clean up the database before tests run and set up the necessary data for the tests. This ensures that each test runs in isolation and that there are no side effects from previous tests.

  Use of Supertest: The integration of Supertest for making HTTP requests allows for a straightforward way to test the API endpoints. It provides an intuitive API for defining requests and expectations.

  Comprehensive Coverage: The tests cover a wide range of scenarios, including getting all jobs, creating a job, updating a job, and deleting a job. This ensures that the core functionalities of the job API are tested.

  Assertions on Database State: After the PUT and DELETE operations, assertions are made to check the state of the database. This ensures that the operations not only return the expected status codes but also perform the intended changes in the database.


Weaknesses:
  Lack of Error Handling: The tests do not handle or assert on error cases. For instance, scenarios like attempting to create a job without necessary fields or trying to delete a job that doesn’t exist are not tested. This can lead to a false sense of security about the robustness of the API.

  Hardcoded User Data: The user signup data used in beforeAll is hardcoded, which might not be ideal for tests that could potentially be run multiple times. This could lead to conflicts or errors if the user already exists in the database.

  Job Creation Logic in BeforeEach: Although jobs are created in the beforeEach block, the specific job data is not reused or validated. It would be more efficient to create a job in a specific test instead, rather than before each test, to keep the tests independent.

  Console Logging for Debugging: The code contains several console.log statements for debugging purposes. While these can be helpful during development, they should be removed or replaced with proper logging for production code to avoid cluttering the test output.

  No Tests for Validation Errors: The tests do not check for proper validation responses when incorrect data is sent to the API. For example, sending a job with missing required fields should return a 400 status code.

  Inconsistent Use of Comments: While some sections are well-commented, others lack comments explaining the purpose of specific tests or logic. Adding comments can improve clarity for future maintainers or developers unfamiliar with the code.


Improvements:
  Add Error Handling Tests: Introduce tests to handle and assert on various error cases, such as trying to create jobs with missing required fields or incorrect data formats. This will enhance the robustness of the test suite.

  Dynamic User Creation: Instead of hardcoding user data, consider implementing a utility function to create users dynamically for each test run. This will prevent conflicts and ensure the database remains clean.

  Optimize Job Creation: Instead of creating a job in the beforeEach block, consider refactoring the tests so that job creation occurs only when necessary, ensuring independence among tests.

  Remove Debugging Logs: Clean up the code by removing console.log statements or replace them with more structured logging only in environments where debugging is needed.

  Validation Error Tests: Add tests to check how the API responds when given invalid input. This will ensure the API correctly handles edge cases and provides meaningful feedback to clients.

  Enhance Comments and Documentation: Improve inline documentation to explain the purpose and expected behavior of various tests. This will assist future developers in understanding the test structure and objectives.

  Use Consistent Naming Conventions: Ensure consistent naming conventions throughout the tests, particularly for variables and functions. For example, naming the job variable consistently can improve code readability.

  Consider Using Test Data Factories: Implement data factories or utility functions for creating test data. This can help streamline the creation of various entities (users, jobs) and maintain consistency across tests.

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

## frontend for no-auth

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
// useField
import { useState } from "react";

export default function useField(type) {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { type, value, onChange };
};
```
```js
// useLogin
import { useState } from "react";

export default function useLogin(url) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const login = async (object) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(object),
        });
        const user = await response.json();
    
        if (!response.ok) {
          setError(user.error);
          setIsLoading(false);
          return error;
        }
    
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
      };

      return { login, isLoading, error };
}
```
```js
// use Signup
import { useState } from "react";

export default function useSignup(url) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });
    const user = await response.json();

    if (!response.ok) {
      console.log(user.error);
      setError(user.error);
      setIsLoading(false);
      return error;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
  };

  return { signup, isLoading, error };
}
```
ChatGPT assessent:

useField Hook
Strengths: Simple and reusable for managing input fields.
Improvements:
Add a reset function to clear the field.
Allow an initial value as a parameter for flexibility.

useLogin Hook
Strengths: Manages login state, handles API call, and stores user/token in localStorage.
Improvements:
Use isLoading: false as the initial state.
Add a try-catch for network error handling.
Return the user data upon successful login.

useSignup Hook
Strengths: Similar to useLogin, handles signup state and API call.
Improvements:
Same enhancements as useLogin: initial isLoading: false, try-catch for errors, return the user after successful signup.

```js
// File name or function
// Your code part B
```