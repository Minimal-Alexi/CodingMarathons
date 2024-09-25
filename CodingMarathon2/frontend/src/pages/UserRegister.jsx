import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSignup from '../hooks/useSignup';
import useField from '../hooks/useField';

const UserRegisterPage = ({ isAuthenticated }) => {
  const { email,
    setEmail,
    password,
    setPassword,
    confirmationPassword,
    setConfirmationPassword,
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    dateofBirth,
    setDateofBirth,
    gender,
    setGender,
    membershipStatus,
    setMembershipStatus,
    handleSignup } = useSignup(isAuthenticated);

  const emailInput = useField('text', email, setEmail);
  const passwordInput = useField('password', password, setPassword);
  const confirmationPasswordInput = useField('password', confirmationPassword, setConfirmationPassword);
  const nameInput = useField('text', name, setName);
  const phoneNumberInput = useField('number', phoneNumber, setPhoneNumber);
  const dateofBirthInput = useField('date', dateofBirth, setDateofBirth);
  const genderInput = useField('select', gender, setGender);
  const membershipStatusInput = useField('select', membershipStatus, setMembershipStatus);

  const submitForm = (e) => 
    {
      e.preventDefault();
    }

  return (
    <section className='bg-indigo-50'>
      <div className='container m-auto max-w-2xl py-24'>
        <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
          <form onSubmit={submitForm} >
            <h2 className='text-3xl text-center font-semibold mb-6'>Create a new account.</h2>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Username
              </label>
              <input {...nameInput} className="border rounded w-full py-2 px-3 mb-2"></input>
            </div>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Email
              </label>
              <input {...emailInput} className="border rounded w-full py-2 px-3 mb-2"></input>
            </div>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Password
              </label>
              <input {...passwordInput} className="border rounded w-full py-2 px-3 mb-2"></input>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Confirm Password
              </label>
              <input {...confirmationPasswordInput} className="border rounded w-full py-2 px-3 mb-2"></input>
            </div>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Phone number:
              </label>
              <input {...phoneNumberInput} className="border rounded w-full py-2 px-3 mb-2"></input>
            </div>

            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Date of birth:
              </label>
              <input {...dateofBirthInput} className="border rounded w-full py-2 px-3"></input>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Gender:
              </label>
              <select {...genderInput} className='border rounded w-full py-2 px-3'>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className='mb-4'>
              <label
                htmlFor='type'
                className='block text-gray-700 font-bold mb-2'
              >
                Membership Type:
              </label>
              <select {...membershipStatusInput} className='border rounded w-full py-2 px-3'>
                <option value="">Select Membership Status</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <button
                className='bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
                type='submit'
                onClick={handleSignup}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default UserRegisterPage;
