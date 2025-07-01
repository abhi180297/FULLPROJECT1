import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:8080/users/create", {
        username,
        email,
        password,
      });

      const result = response.data;
      
      if (result) {
        setMessage("Registration successful! You can now log in.");
        setTimeout(() => navigate("/"), 2000); 
      }
    } catch (error) {
      setMessage("Error: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto", padding: "1rem", textAlign: "center" }}>
      <h2>Create ID</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">Register</button>
      </form>

      <p style={{ color: message.includes("failed") ? "red" : "green" }}>{message}</p>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
