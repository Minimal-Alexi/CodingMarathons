import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useSignup = (setIsAuthenticated) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateofBirth, setDateofBirth] = useState('');
    const [gender, setGender] = useState('');
    const [membershipStatus, setMembershipStatus] = useState('');

    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            /* if (password === confirmationPassword) {
                const response = await fetch("/api/users/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        name,
                        phoneNumber,
                        dateofBirth,
                        gender,
                        membershipStatus,
                    }),
                });

                if (response.ok) {
                    const user = await response.json();
                    sessionStorage.setItem("user", JSON.stringify(user));
                    console.log("User signed up successfully!");
                    setIsAuthenticated(true);
                    navigate("/");
                } else {
                    console.error("Signup failed", response);
                }
            } else {
                console.log("Re-enter confirmation password");
            } */
            console.log(email,
                password,
                name,
                phoneNumber,
                dateofBirth,
                gender,
                membershipStatus,)
        } catch (error) {
            console.error("Error during signup:", error);
        }
    };

    return {
        email,
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
        handleSignup,
    };
};

export default useSignup;
