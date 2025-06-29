import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:8080/users/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        setFormData({ email: userData.email, password: "" });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("token");
          navigate("/");
        }
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleEdit = () => setEditMode(true);

  const handleCancel = () => {
    setFormData({ email: user.email, password: "" });
    setEditMode(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    const payload = {
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://localhost:8080/users/edit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        axios
          .get("http://localhost:8080/users/getUser", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUser(res.data);
            setFormData({ email: res.data.email, password: "" });
            setEditMode(false);
            alert("User updated successfully");
          });
      })
      .catch((err) => {
        console.error("Error updating user:", err);
        alert("Failed to update user");
      });
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    axios
      .delete("http://localhost:8080/users/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Account deleted successfully");
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        alert("Failed to delete account");
      });
  };

  if (!user) return <p>Loading user details...</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
      <h2>User Profile</h2>

      {editMode ? (
        <>
          <p>
            <strong>Username:</strong>{" "}
            <input type="text" value={user.username} readOnly />
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </p>
          <p>
            <strong>Password:</strong>{" "}
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
            />
          </p>
          <button onClick={handleSave}>Save</button>{" "}
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={handleEdit}>Edit</button>{" "}
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete Account
          </button>
        </>
      )}

      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
