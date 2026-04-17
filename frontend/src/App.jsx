import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SocketProvider } from "./context/SocketContext";

// Dynamically import pages (Code Splitting) to reduce initial load time
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const Chat = lazy(() => import("./pages/Chat"));
const LoginSuccess = lazy(() => import("./pages/LoginSuccess"));
const Teaching = lazy(() => import("./pages/Teaching"));
const Learning = lazy(() => import("./pages/Learning"));

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

// Helper component to watch location changes and sync auth state
const AuthWatcher = ({ setUserId }) => {
  const location = useLocation();
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user?._id);
      } catch (e) {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, [location, setUserId]);
  return null;
};

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user?._id);
      } catch (e) {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  return (
    <Router>
      <AuthWatcher setUserId={setUserId} />
      <SocketProvider userId={userId}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/teaching" element={<Teaching />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/login-success" element={<LoginSuccess />} />
          </Routes>
        </Suspense>
      </SocketProvider>
    </Router>
  );
}

export default App;
