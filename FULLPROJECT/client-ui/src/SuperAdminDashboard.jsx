import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import * as XLSX from "xlsx";
import Register from "./Register";
import './SuperAdminDashboard.css';

function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [assets, setAssets] = useState({ open: [], inProgress: [], completed: [] });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);
  const [showLogout, setShowLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [logoUrl] = useState("/logo.png");
  const [showMenu, setShowMenu] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ firstName: "", role: "" });

  const navigate = useNavigate();

  const tabs = [
    "Consumer/ Vendor Analysis",
    "Consumer/ Vendor Open List",
    "Consumer/ Vendor Inprogress List",
    "Consumer/ Vendor Completed List",
  ];

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserInfo({
        firstName: parsedUser.firstName,
        role: parsedUser.roles?.[0]?.roleName || ""
      });
    }

    fetchAllAssets();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const fetchAllAssets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Missing token");
      return;
    }

    const baseURL = process.env.REACT_APP_API_BASE_URL || "";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [openRes, inProgressRes, completedRes] = await Promise.all([
        axios.get(`${baseURL}/assets/GetAllDetailsByOpenStatus`, { headers }),
        axios.get(`${baseURL}/assets/GetAllDetailsByInProgressStatus`, { headers }),
        axios.get(`${baseURL}/assets/GetAllDetailsByCompletedStatus`, { headers }),
      ]);

      setAssets({
        open: openRes.data || [],
        inProgress: inProgressRes.data || [],
        completed: completedRes.data || []
      });
    } catch (err) {
      console.error("API Error", err);
      setError("Failed to fetch asset data.");
    }
  };

  const toggleLogout = () => setShowLogout((prev) => !prev);
  const toggleMenu = () => setShowMenu((prev) => !prev);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleCreateManager = () => {
    setShowRegisterForm(true);
    setShowMenu(false);
  };

  const handleExcelImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const baseURL = process.env.REACT_APP_API_BASE_URL || "";

    try {
      await axios.post(`${baseURL}/importassets`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      alert("Excel imported successfully!");
      fetchAllAssets();
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import Excel file.");
    }
  };

  const handleExport = () => {
    if (!filteredAssets || filteredAssets.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(filteredAssets);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
    XLSX.writeFile(workbook, "assets_export.xlsx");
  };

  const getTabAssets = () => {
    switch (activeTab) {
      case 0:
        return [...assets.open, ...assets.inProgress, ...assets.completed];
      case 1:
        return assets.open;
      case 2:
        return assets.inProgress;
      case 3:
        return assets.completed;
      default:
        return [];
    }
  };

  const filteredAssets = getTabAssets().filter((item) => {
    if (searchTerm.trim() === "") return true;
    const outletKey = Object.keys(item).find((key) => key.toLowerCase() === "outletname");
    if (!outletKey) return false;
    return String(item[outletKey]).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const tabCounts = [
    assets.open.length + assets.inProgress.length + assets.completed.length,
    assets.open.length,
    assets.inProgress.length,
    assets.completed.length,
  ];

  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAssets.length / rowsPerPage);

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658"];
  const chartData = [
    { name: "Open", value: assets.open.length },
    { name: "In Progress", value: assets.inProgress.length },
    { name: "Completed", value: assets.completed.length }
  ];

  return (
    <div className="superadmin-dashboard">
      <div className="dashboard-header">
        <span className="menu-icon" onClick={toggleMenu}>☰</span>
        {showMenu && (
          <div className="menu-dropdown">
            <div className="menu-item" onClick={handleCreateManager}>
              ➕ Create Manager
            </div>
          </div>
        )}

        <input
          className="search-input"
          type="text"
          placeholder="Search Outletname..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {logoUrl && <img src={logoUrl} alt="Logo" className="dashboard-logo" />}
        <span className="welcome-text">
          Welcome - {userInfo.firstName || "SuperAdmin"}
        </span>

        <div className="profile-section">
          <span className="profile-icon" onClick={toggleLogout}>👤</span>
          {showLogout && (
            <div className="logout-dropdown" onClick={handleLogout}>
              Logout
            </div>
          )}
        </div>
      </div>

      {showRegisterForm ? (
        <Register />
      ) : (
        <>
          <h1 className="dashboard-title">
            {userInfo.firstName ? `${userInfo.firstName}, HI` : "SuperAdmin, HI"}
          </h1>

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

            <button className="export-btn" onClick={handleExport}>
              ⬇ Export to Excel
            </button>

            <h2 className="tab-title">{tabs[activeTab]}</h2>

            {activeTab === 0 && (
              <div className="charts-container" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "1rem" }}>
                <div style={{ width: "100%", maxWidth: "500px" }}>
                  <h3 style={{ textAlign: "center" }}>Bar Chart - Asset Status</h3>
                  <BarChart width={500} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>

                <div style={{ width: "100%", maxWidth: "400px" }}>
                  <h3 style={{ textAlign: "center" }}>Pie Chart - Asset Status</h3>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>
            )}

            {activeTab !== 0 && paginatedAssets && paginatedAssets.length > 0 && paginatedAssets[0] ? (
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
                              <Link to={`/vctype-details/${encodeURIComponent(value)}`} style={{ color: "#007bff", textDecoration: "underline" }}>
                                {value}
                              </Link>
                            ) : key.toLowerCase() === "batch" ? (
                              <Link to={`/ProductDetails`} style={{ color: "#28a745", textDecoration: "underline" }}>
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

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`pagination-btn-number ${page === currentPage ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

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
              activeTab !== 0 && !error && <p className="no-data-text">No data found for this tab.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SuperAdminDashboard;
