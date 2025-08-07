import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./VctypeDetails.css";

function VctypeDetails() {
  const { vctype } = useParams();
  const [data, setData] = useState(null);
  const [rvManagerStatus, setRvManagerStatus] = useState("");
  const [bcManagerStatus, setBcManagerStatus] = useState("");
  const [comments, setComments] = useState({});
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.roles?.[0]?.roleName?.toUpperCase();

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
          setRvManagerStatus(response.data.rvManagerStatus || "");
          setBcManagerStatus(response.data.bcManagerStatus || "");
          setComments(response.data.comments || {});
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [vctype]);

  const updateStatus = async (field, value) => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");

    const payload = {
      [field]: value,
    };

    try {
      await axios.post(`${baseURL}/assets/update-status/${vctype}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const rv = field === "rvManagerStatus" ? value : rvManagerStatus;
      const bc = field === "bcManagerStatus" ? value : bcManagerStatus;

      if (rv && bc && rv === bc) {
        await axios.post(
          `${baseURL}/assets/update-excel-status/${vctype}`,
          { excelStatus: rv },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setMessage("✅ Excel status updated (both approvals matched).");
      } else {
        setMessage("✅ Status updated.");
      }
    } catch (error) {
      console.error("Status update failed:", error);
      setMessage("❌ Status update failed.");
    }
  };

  const handleCommentSave = async () => {
    const baseURL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");
    const updatedComments = {
      ...comments,
      [role]: comments[role] || "",
    };

    try {
      await axios.post(
        `${baseURL}/assets/update-comment/${vctype}`,
        { comments: updatedComments },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Comment saved successfully.");
    } catch (error) {
      console.error("Failed to save comment:", error);
      setMessage("Failed to save comment.");
    }
  };

  if (!data) return <div>Loading...</div>;

  const imageBaseURL = "https://sarsatiya.store/images/";
  const placeholder = "https://via.placeholder.com/150";

  const getImageUrl = (filename) => {
    if (!filename) return placeholder;
    return imageBaseURL + filename.split("/").pop();
  };

  const roleRoutes = {
    SUPERADMIN: "/superadmin-dashboard",
    ADMIN: "/admin-dashboard",
    JRMANAGER: "/RVManager-dashboard",
    SRMANAGER: "/BCManager-dashboard",
    RVMANAGER: "/RVManager-dashboard",
    BCMANAGER: "/BCManager-dashboard",
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
          <h4>RVManager Approval</h4>
          {role === "RVMANAGER" ? (
            <select
              value={rvManagerStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setRvManagerStatus(newStatus);
                updateStatus("rvManagerStatus", newStatus);
              }}
            >
              <option value="">-- Select Status --</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          ) : (
            <p>Status: {rvManagerStatus || "N/A"}</p>
          )}
        </div>

        <div className="approval-card">
          <h4>BCManager Approval</h4>
          {role === "BCMANAGER" ? (
            <select
              value={bcManagerStatus}
              onChange={(e) => {
                const newStatus = e.target.value;
                setBcManagerStatus(newStatus);
                updateStatus("bcManagerStatus", newStatus);
              }}
            >
              <option value="">-- Select Status --</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          ) : (
            <p>Status: {bcManagerStatus || "N/A"}</p>
          )}
        </div>
      </div>

      <div className="image-grid">
        {["outletOwnerPic", "outletOwnerIdsPics", "assetPics", "outletExteriorsPhoto", "serialNoPic"].map((field, index) => (
          <div key={index} className="image-card">
            <h4>{field.replace(/([A-Z])/g, " $1")}</h4>
            <img src={getImageUrl(data[field])} alt={field} onError={(e) => e.target.src = placeholder} />
          </div>
        ))}
      </div>

      {/* Comment Section */}
      <div className="comment-box">
        <h4>Comments</h4>
        {Object.entries({ ADMIN: "Admin", SUPERADMIN: "SuperAdmin", RVMANAGER: "RVManager", BCMANAGER: "BCManager" }).map(([key, label]) => (
          <div key={key} style={{ marginBottom: "15px" }}>
            <strong>{label}:</strong>
            {role === key ? (
              <>
                <textarea
                  value={comments[key] || ""}
                  onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
                  rows={3}
                  style={{ width: "100%", padding: "5px" }}
                />
              </>
            ) : (
              <p style={{ whiteSpace: "pre-wrap" }}>{comments[key] || "No comment."}</p>
            )}
          </div>
        ))}

        {role in comments && (
          <button onClick={handleCommentSave} style={{ marginTop: "10px" }}>
            Save Comment
          </button>
        )}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </div>
    </div>
  );
}

export default VctypeDetails;
