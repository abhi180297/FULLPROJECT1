import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Profile from "./Profile";
import Register from "./Register";
import AssetDetails from "./AssetDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/assetdetails" element={<AssetDetails/>} />
      </Routes>
    </Router>
  );
}

export default App;
