import { jobContext } from '../contexts/jobContext';
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useField from '../hooks/useField';

const EditJobPage = () => {
  const [loading,setLoading] = useState(true);
  const [job,setJob] = useState([])
  const {id} = useParams();
  const {jobFetchingbyID} = useContext(jobContext);


  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [location,setLocation] = useState('');
  const [salary,setSalary] = useState('');
  const [status,setStatus] = useState('');


  const titleField = useField('text', title, setTitle);
  const typeField = useField('select', type, setType);
  const descriptionField = useField('text', description, setDescription);
  const nameField = useField('text', name, setName);
  const companyEmailField = useField('text', companyEmail, setCompanyEmail);
  const companyPhoneField = useField('text', companyPhone, setCompanyPhone);
  const locationField = useField('text',location,setLocation);
  const jobSalaryField = useField('number',salary,setSalary);
  const statusField = useField('select',status,setStatus);
  
  const submitForm = async (e) => {
    e.preventDefault();

    console.log("submitForm called");
    if (!title || !type || !description || !name || !companyEmail || !companyPhone || !location || !salary || !statusField) {
      console.log('Fill all the fields');
      return;
    }
    if(salary < 0 )
      {
        console.log("Salary cant be smaller than 0");
        return;
      }


    const company = 
    {
      name,
      contactEmail : companyEmail,
      contactPhone : companyPhone,
    }

    const job = {
      title,
      type,
      description,
      company,
      location,
      salary,
      postedDate : new Date,
      status
    }
   
    const jwt = localStorage.getItem("jwt");

    const response = await fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    });

    if (!response.ok) {
      console.log('Error while editing job')
    } else {
      setTitle('');
      setType('');
      setDescription('');
      setName('');
      setCompanyEmail('');
      setCompanyPhone('');
      setLocation('');
      setStatus('');
      setSalary('');
    }
    console.log(response);
  };

  useEffect(() => 
    {
      const jobFetch = async () =>
        {
          const fetchedJob = await jobFetchingbyID(id);
          setJob(fetchedJob)
          setLoading(false);
        }
      jobFetch();
      if (job && job.length != 0)
        {
          setTitle(job.title);
          setType(job.type);
          setDescription(job.description);
          setName(job.company.name);
          setCompanyEmail(job.company.contactEmail);
          setCompanyPhone(job.company.contactPhone);
          setLocation(job.location);
          setStatus(job.status);
          setSalary(job.salary);
        }
    },[id,loading]);

  if (job.length == 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="create">
      <h2>Edit the job.</h2>
      <form onSubmit={submitForm}>
        <label>Job title:</label>
        <input
          {...titleField}
          required
        />
        <label>Job type:</label>
        <select {...typeField} required>
          <option value="" defaultValue>Select job type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <label>Job Description:</label>
        <textarea
          {...descriptionField}
          required

        ></textarea>
        <label>Company Name:</label>
        <input
          {...nameField}
          required
        />
        <label>Contact Email:</label>
        <input
          {...companyEmailField}
          required
        />
        <label>Contact Phone:</label>
        <input
          {...companyPhoneField}
          required
        />
        <label>Address:</label>
        <input
          {...locationField}
          required
        />
        <label>Salary:</label>
        <input
          {...jobSalaryField}
          required
        />
        <label>Status:</label>
        <select {...statusField} required>
          <option value="" defaultValue>Select availability status</option>
          <option value="open">Open</option>
          <option value="closed">Unavailable</option>
        </select>
        <button>Edit Job</button>
      </form>
    </div>
  );
};

export default EditJobPage;
