import { useState } from "react";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import useField from '../hooks/useField';

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('');

  const nameField = useField("text", name, setName);
  const emailField = useField("email", email, setEmail);
  const passwordField = useField("password", password, setPassword);
  const phoneNumberField = useField("text", phoneNumber, setPhoneNumber);
  const genderField = useField("text", gender, setGender);
  const dateOfBirthField = useField("date", dateOfBirth, setDateOfBirth);
  const membershipStatusField = useField("text", membershipStatus, setMembershipStatus);



  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      email: email,
      password: password,
      name: name,
      phone_number: phoneNumber,
      gender: gender,
      date_of_birth: dateOfBirth,
      membership_status: membershipStatus,
    });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...nameField} />
        <label>Email address:</label>
        <input {...emailField} />
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
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
