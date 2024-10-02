import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// contexts
import { JobProvider } from "./contexts/jobContext";


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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="App">
      <JobProvider>
        <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated} />
          <div className="content">
            <Routes>
              <Route path="/signup" element={<SignUp setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login" element={<LogIn setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/" element={<Home isAuthenticated={isAuthenticated}/>} />
              <Route path="/:id" element={<JobPage />} />
              <Route path="/edit-job/:id" element={<EditJobPage />} />
              <Route path="/add-job" element={<AddJobPage />} />
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </JobProvider>
    </div>
  );
}

export default App;
