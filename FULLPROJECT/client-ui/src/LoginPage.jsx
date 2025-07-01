import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8080/users/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const result = response.data;

      if (result.startsWith("ERROR")) {
        setIsError(true);
        setMessage("Login failed: " + result.replace("ERROR: ", ""));
      } else {
        setIsError(false);
        localStorage.setItem("token", result);
        setMessage("Login successful");
        navigate("/Profile");
      }

    } catch (error) {
      const errMsg = error.response?.data?.error || error.response?.data || error.message;
      setIsError(true);
      setMessage("Login failed: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "auto", padding: "1rem", textAlign: "center" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ color: isError ? "red" : "green" }}>{message}</p>

      {/* Create ID Link */}
      <p style={{ marginTop: "1rem" }}>
        Don't have an account? <Link to="/register">sign up</Link>
      </p>
    </div>
  );
}

export default Login;
