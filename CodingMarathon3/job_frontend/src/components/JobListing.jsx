import { useNavigate } from "react-router-dom";

const JobListing = ({ job, handleDelete, isAuthenticated }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${job._id}`)
  }

  const handleEdit = () => {
    navigate(`/edit-job/${job._id}`)
  }

  return (
    <div className="job-preview">
      <div onClick={() => handleClick(job._id)}>
        <h2>{job.title}</h2>
        <p>Type: {job.type}</p>
        <p>Description: {job.description}</p>
        <p>Company: {job.company.name}</p>
        <p>Company email: {job.company.contactEmail}</p>
        <p>Company phone: {job.company.contactPhone}</p>
      </div>
      <div>
        {isAuthenticated ? (
          <>
                <button onClick={() => handleDelete(job._id)}>Click me to delete</button>
                <button onClick={() => handleEdit(job._id)}>Click me to edit the job listing.</button>
          </>
        ) : (
          <>
          </>
        )}
      </div>
    </div>
  );
};

export default JobListing;
