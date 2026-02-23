import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="glass" style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1000,
            padding: "1rem 0",
            borderBottom: "1px solid var(--glass-border)"
        }}>
            <div className="container" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(to right, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    SkillSwap
                </Link>

                <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                    <Link to="/explore" style={{ fontSize: "0.9rem", color: location.pathname === "/explore" ? "var(--primary)" : "var(--text-muted)", fontWeight: location.pathname === "/explore" ? "600" : "400" }}>Explore</Link>
                    <a href="#" style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Community</a>

                    {isLoggedIn ? (
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <Link to="/profile" style={{ fontSize: "0.9rem", color: location.pathname === "/profile" ? "var(--primary)" : "var(--text-muted)", fontWeight: location.pathname === "/profile" ? "600" : "400" }}>Profile</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    borderRadius: "12px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button style={{
                                padding: "0.6rem 1.8rem",
                                background: "var(--primary)",
                                color: "white",
                                borderRadius: "50px",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                boxShadow: "0 4px 15px var(--primary-glow)"
                            }}>
                                Join Now
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
