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