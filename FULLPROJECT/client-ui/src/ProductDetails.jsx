import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams(); // Assuming mobile number is passed as `id`
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssetById = async () => {
      let token = localStorage.getItem("token");

      try {
        const parsed = JSON.parse(token);
        if (parsed?.token) token = parsed.token;
      } catch (e) {}

      if (!token || typeof token !== "string") {
        setError("Missing or invalid token");
        return;
      }

      try {
        const baseUrl = process.env.REACT_APP_API_BASE_URL || "";
        const url = `${baseUrl}/XJAAM-0.0.1-SNAPSHOT/getstudentbybatch/${id}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setAsset(response.data);
        } else {
          setError("No data found");
        }
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch asset");
      }
    };

    fetchAssetById();
  }, [id]);

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  if (!asset) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem", flexWrap: "wrap" }}>
      {/* Left Column */}
      <div
        style={{
          flex: "1",
          minWidth: "350px",
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
        }}
      >
        <h2 style={{ marginBottom: "1rem", fontWeight: "600" }}>
          VC Serial No. :- {asset.vcSerialNo || asset.VC_SERIAL_NO}
        </h2>
        <ul style={{ listStyle: "disc", paddingLeft: "1.5rem" }}>
          <li><strong>VC Type:</strong> {asset.vcType || asset.VC_TYPE}</li>
          <li><strong>UOC:</strong> {asset.uoc || asset.UOC}</li>
          <li><strong>Outlet Name:</strong> {asset.outletName}</li>
          <li><strong>Contact Person:</strong> {asset.contactPerson}</li>
          <li><strong>Mobile Number:</strong> {asset.mobileNumber}</li>
          <li><strong>Address:</strong> {asset.address}</li>
          <li><strong>State:</strong> {asset.state}</li>
          <li><strong>Postal Code:</strong> {asset.postalCode}</li>
        </ul>
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: "1",
          minWidth: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}
      >
        {/* RBM Approval Card */}
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h3>RBM Approval</h3>
          <p><strong>Status:</strong> {asset.installationStatus || "Open"}</p>
          <label htmlFor="rbm-status">Installation Status:</label>
          <select id="rbm-status" style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
            <option value="">Select</option>
            <option value="Open">Open</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              background: "#004085",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Save
          </button>
        </div>

        {/* DCW Approval Card */}
        <div
          style={{
            background: "#fff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
          }}
        >
          <h3>DCW Approval 2</h3>
          <p><strong>Status:</strong> {asset.installationStatus || "Open"}</p>
          <label htmlFor="dcw-status">Installation Status:</label>
          <select id="dcw-status" style={{ width: "100%", padding: "8px", marginTop: "5px" }}>
            <option value="">Select</option>
            <option value="Open">Open</option>
            <option value="InProgress">InProgress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
