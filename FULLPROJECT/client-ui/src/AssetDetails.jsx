import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AssetDetails() {
  const [assets, setAssets] = useState([]);
  const token = localStorage.getItem("token");
useEffect(() => {
  axios
    .get("http://localhost:8080/users/getAssets", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      const data = res.data;

      // Log and validate what type of data you're getting
      console.log("Fetched asset data:", data);

      // Only set data if it's an array
      if (Array.isArray(data)) {
        setAssets(data);
      } else {
        console.error("Expected an array, but got:", typeof data);
        setAssets([]);
      }
    })
    .catch((err) => {
      console.error("Error fetching assets:", err);
      setAssets([]);
    });
}, [token]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Asset Details</h2>
      
      {assets.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              {Object.keys(assets[0]).map((key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index}>
                {Object.values(asset).map((value, i) => (
                  <td key={i}>{String(value)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assets found.</p>
      )}
    </div>
  );
}

export default AssetDetails;
