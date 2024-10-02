import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// contexts
import { JobProvider } from "./contexts/jobContext";
import { AuthProvider } from "./contexts/authContext";

// pages & components
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import SignUp from "./pages/Signup";
import LogIn from "./pages/Login";

const App = () => {

  return (
    <div className="App">
      <AuthProvider>
        <JobProvider>
          <BrowserRouter>
            <Navbar/>
            <div className="content">
              <Routes>
                <Route path="/signup" element={<SignUp/>} />
                <Route path="/login" element={<LogIn/>} />
                <Route path="/" element={<Home/>} />
                <Route path="/:id" element={<JobPage />} />
                <Route path="/edit-job/:id" element={<EditJobPage />} />
                <Route path="/add-job" element={<AddJobPage />} />
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </JobProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
