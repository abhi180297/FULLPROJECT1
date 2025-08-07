import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.roles?.[0]?.roleName?.toUpperCase();

    if (token && role) {
      switch (role) {
        case "SUPERADMIN":
          navigate("/superadmin-dashboard");
          break;
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "RVMANAGER":
          navigate("/RVManager-dashboard");
          break;
        case "BCMANAGER":
          navigate("/BCManager-dashboard");
          break;
        case "SALESPERSON":
          navigate("/salesPerson-dashboard");
          break;
        case "VENDOR":
          navigate("/vendor-dashboard");
          break;
        default:
          console.warn("⚠️ Unknown role during auto-login:", role);
          break;
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    const loginURL = "https://sarsatiya.store/XJAAM1-0.0.1-SNAPSHOT/token/generate-token";
    const payload = { username, password };

    try {
      const response = await axios.post(loginURL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = response.data;
      console.log("🔐 Login Response:", result);

      if (result && result.token && result.user) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setMessage("Login successful!");

        const role = result.user?.roles?.[0]?.roleName?.toUpperCase();
        console.log("✅ User role:", role);

        switch (role) {
          case "SUPERADMIN":
            navigate("/superadmin-dashboard");
            break;
          case "ADMIN":
            navigate("/admin-dashboard");
            break;
          case "RVMANAGER":
            navigate("/RVManager-dashboard");
            break;
          case "BCMANAGER":
            navigate("/BCManager-dashboard");
            break;
          case "SALESPERSON":
            navigate("/salesPerson-dashboard");
            break;
          case "VENDOR":
            navigate("/vendor-dashboard");
            break;
          default:
            setIsError(true);
            setMessage("Login failed: Unknown user role.");
            console.error("❌ Unknown role:", role);
        }
      } else {
        setIsError(true);
        setMessage("Login failed: Invalid username or password.");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Login failed: Unexpected error.";
      setIsError(true);
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p className={`login-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
