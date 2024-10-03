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
        console.error('Failed to fetch products');
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
                console.log("Succesfully found product.")
                return data;
            }
        } catch (error) {
            console.error(error);
            console.error('Failed to fetch product')
            return false;
        }
    }
    
    const handleDelete = async (_id) => {
        try
        {
          const credentials = JSON.parse(localStorage.getItem("user"));
          const jwt = credentials.token;
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
                console.log("Succesfully deleted product.");
              }
        }catch (error) {
          console.error(error);
          console.error('Failed to delete product');
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