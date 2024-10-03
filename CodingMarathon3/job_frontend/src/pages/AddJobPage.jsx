import { useState } from "react";
import useField from '../hooks/useField';

const AddJobPage = () => {

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
    
    const response = await fetch('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    });

    if (!response.ok) {
      console.log('Error while creating job')
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

  return (
    <div className="create">
      <h2>Add a New Job</h2>
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
        <button>Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
