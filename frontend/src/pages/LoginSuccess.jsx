import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const user = params.get("user");

        if (token && user) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", decodeURIComponent(user));
            navigate("/profile");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return (
        <div style={{ 
            height: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            background: "var(--bg-color)",
            color: "var(--text-main)"
        }}>
            <div style={{ textAlign: "center" }}>
                <div className="spinner" style={{
                    width: "40px",
                    height: "40px",
                    border: "4px solid var(--primary-glow)",
                    borderTop: "4px solid var(--primary)",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 1rem"
                }}></div>
                <p>Completing login...</p>
            </div>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default LoginSuccess;
