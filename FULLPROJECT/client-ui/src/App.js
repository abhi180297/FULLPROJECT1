import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage.jsx";
import Profile from "./Profile";
import Register from "./Register";
import AssetDetails from "./AssetDetails";
import SuperAdminDashboard from "./SuperAdminDashboard";
import AdminDashboard from "./Admin_Dashboard";
import ProductDetails from "./ProductDetails"; 
import VctypeDetails from "./VctypeDetail.jsx";
import RVManagerDashboard from "./RVManagerDashboard";
import BCManagerDashboard from "./BCManagerDashboard";
import SalesPersonDashboard from "./SalesPersonDashboard";
import VendorDashboard from "./VendorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/assetdetails" element={<AssetDetails/>} />
        <Route path="/productdetails" element={<ProductDetails />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/vctype-details/:vctype" element={<VctypeDetails />} />
        <Route path="/assetdetails/:id" element={<AssetDetails />} />
        <Route path="/RVManager-dashboard" element={<RVManagerDashboard />} />
        <Route path="/BCManager-dashboard" element={<BCManagerDashboard />} />
        <Route path="/salesperson-dashboard" element={<SalesPersonDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />


      
      </Routes>
    </Router>
  );
}

export default App;
