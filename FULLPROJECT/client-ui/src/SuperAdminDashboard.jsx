import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import './SuperAdminDashboard.css';


function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [assets, setAssets] = useState({
    open: [],
    inProgress: [],
    completed: [],
    closed: []
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogout, setShowLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoUrl] = useState("/logo.png");

  const navigate = useNavigate();
  const rowsPerPage = 10;

  const tabs = [
    "Consumer/ Vendor Analysis",
    "Consumer/ Vendor Open List",
    "Consumer/ Vendor Inprogress List",
    "Consumer/ Vendor Completed List",
    
  ];

  useEffect(() => {
    const fetchAllAssets = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Missing token");
        return;
      }

      const baseURL = process.env.REACT_APP_API_BASE_URL ||"";
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [openRes, inProgressRes, completedRes, closedRes] = await Promise.all([
          axios.get(`${baseURL}/assets/GetAllDetailsByOpenStatus`, { headers }),
          axios.get(`${baseURL}/assets/GetAllDetailsByInProgressStatus`, { headers }),
          axios.get(`${baseURL}/assets/GetAllDetailsByCompletedStatus`, { headers }),
          axios.get(`${baseURL}/assets/GetAllDetailsByClosedStatus`, { headers })
        ]);

        setAssets({
          open: openRes.data || [],
          inProgress: inProgressRes.data || [],
          completed: completedRes.data || [],
          closed: closedRes.data || []
        });
      } catch (err) {
        console.error("API Error", err);
        setError("Failed to fetch asset data.");
      }
    };

    fetchAllAssets();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset page on tab or search
  }, [activeTab, searchTerm]);

  const toggleLogout = () => setShowLogout((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log("Selected Excel file:", file.name);
  };

  const getTabAssets = () => {
    switch (activeTab) {
      case 0:
        return [
          ...assets.open,
          ...assets.inProgress,
          ...assets.completed,
          ...assets.closed
        ];
      case 1:
        return assets.open;
      case 2:
        return assets.inProgress;
      case 3:
        return assets.completed;
      case 4:
        return assets.closed;
      default:
        return [];
    }
  };

  // ✅ Dynamic case-insensitive search for OUTLETNAME
  const filteredAssets = getTabAssets().filter((item) => {
    if (searchTerm.trim() === "") return true;

    const outletKey = Object.keys(item).find(
      (key) => key.toLowerCase() === "outletname"
    );

    if (!outletKey) return false;

    return String(item[outletKey])
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const tabCounts = [
    assets.open.length + assets.inProgress.length + assets.completed.length ,
    assets.open.length,
    assets.inProgress.length,
    assets.completed.length,
    
  ];

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAssets.length / rowsPerPage);

  return (
    <div className="superadmin-dashboard">
      <div className="dashboard-header">
        <span className="menu-icon">☰</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search Outletname..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {logoUrl && <img src={logoUrl} alt="Logo" className="dashboard-logo" />}
        <span className="welcome-text">Welcome - superadmin.</span>

        <div className="profile-section">
          <span className="profile-icon" onClick={toggleLogout}>👤</span>
          {showLogout && (
            <div className="logout-dropdown" onClick={handleLogout}>
              Logout
            </div>
          )}
        </div>
      </div>

      <h1 className="dashboard-title">Super Admin, HI</h1>

      <div className="dashboard-tabs custom-tabs tab-scroll">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`tab-btn${activeTab === index ? " active" : ""}`}
          >
            <span className="tab-label">{tab}</span>{" "}
            <span className="tab-count">({tabCounts[index]})</span>
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        <label className="import-btn" htmlFor="excel-import-input">
          + Import Excel
          <input
            id="excel-import-input"
            className="import-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
          />
        </label>

        <h2 className="tab-title">{tabs[activeTab]}</h2>

        {error && <p className="error-text">Error: {error}</p>}
        {paginatedAssets && paginatedAssets.length > 0 && paginatedAssets[0] ? (
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  {Object.keys(paginatedAssets[0]).map((key) => (
                    <th key={key}>{key.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedAssets.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                   {Object.entries(item).map(([key, value], i) => (
  <td key={i}>
    {key.toLowerCase() === "vctype" ? (
      <Link
        to={`/vctype-details/${encodeURIComponent(value)}`}
        style={{ color: "#007bff", textDecoration: "underline" }}
      >
        {value}
      </Link>
    ) : key.toLowerCase() === "batch" ? (
      <Link
        to={`/ProductDetails`}
        style={{ color: "#28a745", textDecoration: "underline" }}
      >
        {value}
      </Link>
    ) : (
      String(value)
    )}
  </td>
))}

                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination" style={{ marginTop: "1.5rem" }}>
              <button
                className="pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          !error && <p className="no-data-text">No data found for this tab.</p>
        )}
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
