import { useState } from "react";
import useLogin from "../hooks/useLogin";
import useField from '../hooks/useField';
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailField = useField("text", email, setEmail);
    const passwordField = useField("password", password, setPassword);

    const { login, error } = useLogin("/api/users/login")

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await login({
            email: email,
            password: password,
        });
        if (!error) {
            console.log("success");
            setIsAuthenticated(true);
            navigate("/");
        }
    }

    return (
        <div className="login">
            <h2>Log in</h2>
            <form onSubmit={handleFormSubmit}>
                <label>Email address:</label>
                <input {...emailField} />
                <label>Password:</label>
                <input {...passwordField} />
                <button>Log in</button>
            </form>
        </div>
    )
};

export default Login;