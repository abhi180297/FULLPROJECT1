import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AssetDetails() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);

  const apiURL = `${process.env.REACT_APP_API_BASE_URL}/XJAAM-0.0.1-SNAPSHOT/getallstudentsitting`;

  useEffect(() => {
    const fetchAssets = async () => {
     let token = localStorage.getItem("token");

      try {
        const parsed = JSON.parse(token);
        if (parsed?.token) token = parsed.token;
      } catch (e) {
        
      }

      if (!token || typeof token !== "string") {
        console.error("No valid token found.");
        setError("Missing or invalid token.");
        return;
      }

      console.log("API URL:", apiURL);
      console.log("Token used:", token);

      try {
        console.log("Final Authorization header:", `Bearer ${token}`);
        //debugger
        const res = await axios.get(apiURL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Fetched data:", res.data);
        if (Array.isArray(res.data)) {
          setAssets(res.data);
        } else {
          setError("Unexpected response format");
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err?.response?.data?.error || "Internal Server Error");
      }
    };

    fetchAssets();
  }, [apiURL]); //  token in dependency array

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Asset Details</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

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
        !error && <p>Loading...</p>
      )}
    </div>
  );
}

export default AssetDetails;
