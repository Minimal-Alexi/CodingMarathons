import { jobContext } from '../contexts/jobContext';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import JobListing from "../components/JobListing";

const job = () => {
    const [jobs, setJobs] = useState([]);
    const { id } = useParams();
    const { handleDelete } = useContext(jobContext);
    const jobFetching = async () => {
        try {
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            }
        } catch (error) {
            console.error(error);
            console.error('Failed to fetch products')
        }
    }

    useEffect(() => {
        jobFetching();
    }, [id]);
    if (jobs.length == 0) {
        return <div>Loading...</div>;
      }
    return (
        <div className="job-list">
            <JobListing key={jobs._id} job={jobs} handleDelete={handleDelete} />
        </div>
    )
}

export default job;