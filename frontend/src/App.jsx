import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Dynamically import pages (Code Splitting) to reduce initial load time
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const LoginSuccess = lazy(() => import("./pages/LoginSuccess"));

const PageLoader = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-color)" }}>
    <div style={{ 
       width: "48px", height: "48px", 
       border: "3px solid rgba(99, 102, 241, 0.2)", 
       borderBottomColor: "var(--primary)", 
       borderRadius: "50%", 
       animation: "spin 1s linear infinite" 
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login-success" element={<LoginSuccess />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
