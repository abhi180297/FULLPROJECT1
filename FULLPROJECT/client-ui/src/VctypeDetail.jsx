import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./VctypeDetails.css";

function VctypeDetails() {
  const { vctype } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `${baseURL}/assets/GetAssetByVctype/${vctype}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setData(response.data);
          setStatus(response.data.status);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [vctype]);

  const handleStatusSave = async () => {
    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const token = localStorage.getItem("token");

      await axios.put(
        `${baseURL}/assets/update-status/${vctype}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Status updated successfully.");
    } catch (error) {
      console.error("Failed to update status:", error);
      setMessage("Failed to update status.");
    }
  };

  if (!data) return <div>Loading...</div>;

  const imageBaseURL = "https://sarsatiya.store/images/";
  const placeholder = "https://via.placeholder.com/150";

  const getImageUrl = (filename) => {
    if (!filename) return placeholder;
    return imageBaseURL + filename.split("/").pop();
  };

  // Dynamic Back Button Path
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.roles?.[0]?.roleName?.toUpperCase();
  const roleRoutes = {
    Superadmin: "/superadmin-dashboard",
    ADMIN: "/admin-dashboard",
    JRMANAGER: "/manager1-dashboard",
    SRMANAGER: "/manager2-dashboard",
    SALESPERSON: "/sales-dashboard",
    VENDOR: "/vendor-dashboard",
  };
  const backPath = roleRoutes[role] || "/";

  return (
    <div className="vctype-page">
      <h2>Vendor Details</h2>
      <Link to={backPath} className="back-link">← Back</Link>

      <div className="info-section">
        <div className="info-card">
          <h3>VC Serial No.: {data.vcSerialNo}</h3>
          <p><strong>VC Type:</strong> {data.vcType}</p>
          <p><strong>UOC:</strong> {data.uoc}</p>
          <p><strong>Outlet Name:</strong> {data.outletName}</p>
          <p><strong>Contact Person:</strong> {data.contactPerson}</p>
          <p><strong>Mobile Number:</strong> {data.mobileNumber}</p>
          <p><strong>Address:</strong> {data.address}</p>
          <p><strong>State:</strong> {data.state}</p>
          <p><strong>Postal Code:</strong> {data.postalCode}</p>
        </div>

        <div className="approval-card">
          <h4>Manager1 Approval</h4>
          <p>Status: {status}</p>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button onClick={handleStatusSave}>Save</button>
          {message && <p className="status-message">{message}</p>}
        </div>

        <div className="approval-card">
          <h4>Manager2 Approval</h4>
          <p>Status: {data.status}</p>
        </div>
      </div>

      <div className="image-grid">
        <div className="image-card">
          <h4>Owner</h4>
          <img src={getImageUrl(data.outletOwnerPic)} alt="Owner"
            onError={(e) => e.target.src = placeholder} />
        </div>
        <div className="image-card">
          <h4>Identity</h4>
          <img src={getImageUrl(data.outletOwnerIdsPics)} alt="Identity"
            onError={(e) => e.target.src = placeholder} />
        </div>
        <div className="image-card">
          <h4>Compliance</h4>
          <img src={getImageUrl(data.assetPics)} alt="Compliance"
            onError={(e) => e.target.src = placeholder} />
        </div>
        <div className="image-card">
          <h4>Store</h4>
          <img src={getImageUrl(data.outletExteriorsPhoto)} alt="Store"
            onError={(e) => e.target.src = placeholder} />
        </div>
        <div className="image-card">
          <h4>Serial No</h4>
          <img src={getImageUrl(data.serialNoPic)} alt="Serial Number"
            onError={(e) => e.target.src = placeholder} />
        </div>
      </div>
    </div>
  );
}

export default VctypeDetails;
