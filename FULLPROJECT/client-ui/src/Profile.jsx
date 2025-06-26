import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleEdit = ()=>{
    
  }
  useEffect(() => {
    // Redirect to "/" if token is missing
    if (!token) {
      navigate("/");
      return;
    }

    axios.get("http://localhost:8080/users/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => setUser(response.data))
    .catch((err) => {
      console.error("Error fetching user data:", err);

      // Redirect to "/" if token is invalid or expired
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

  if (!user) return <p>Loading user details...</p>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button type="submit" onClick={handleEdit}></button>
      <button onClick={handleLogout}>LOGOUT</button>
    </div>
  );
}

export default Profile;
