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
