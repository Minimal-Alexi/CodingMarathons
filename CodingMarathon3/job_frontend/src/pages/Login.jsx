import { useState } from "react";
import useLogin from "../hooks/useLogin";
import useField from '../hooks/useField';
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const usernameField = useField("text", username, setUsername);
    const passwordField = useField("password", password, setPassword);

    const { login, error } = useLogin("/api/users/login")

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await login({
            username: username,
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
                <label>username:</label>
                <input {...usernameField} />
                <label>Password:</label>
                <input {...passwordField} />
                <button>Log in</button>
            </form>
        </div>
    )
};

export default Login;