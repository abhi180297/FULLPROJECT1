import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import bcrypt from "bcryptjs";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      // Hash the password before sending it to the backend
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const response = await axios.post("http://localhost:8080/users/create", {
        username,
        email,
        password: hashedPassword,
      });

      const result = response.data;

      if (result) {
        setMessage("Registration successful! You can now log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setIsError(true);
      setMessage("Error: " + (error.response?.data || error.message));
    } finally {
      setLoading(false);
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
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <p style={{ color: isError ? "red" : "green", marginTop: "1rem" }}>{message}</p>
      )}

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Register;
