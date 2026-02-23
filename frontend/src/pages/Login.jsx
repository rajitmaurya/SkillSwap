import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            navigate("/profile");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "stretch", // Stretch to fill height
                background: "var(--bg-color)"
            }}>
                {/* Left Side: Info & Branding (Hidden on small screens) */}
                <div style={{
                    flex: 1,
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "4rem",
                    color: "white",
                    position: "relative",
                    overflow: "hidden"
                }} className="login-side-panel">
                    {/* Decorative Elements */}
                    <div style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-10%",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        filter: "blur(60px)"
                    }}></div>
                    <div style={{
                        position: "absolute",
                        bottom: "10%",
                        left: "-5%",
                        width: "200px",
                        height: "200px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.05)",
                        filter: "blur(40px)"
                    }}></div>

                    <div style={{ position: "relative", zIndex: 1 }} className="animate-fade-in">
                        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "1.5rem", lineHeight: "1.1" }}>
                            Learn. Swap.<br />Grow Together.
                        </h1>
                        <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "450px", marginBottom: "3rem", lineHeight: "1.6" }}>
                            Join over 5,000+ experts sharing skills every day. From coding to cooking, find your next mentor here.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                            <div style={{ background: "rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "24px", backdropFilter: "blur(10px)" }}>
                                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>2.4k+</h3>
                                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Swaps Completed</p>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.1)", padding: "1.5rem", borderRadius: "24px", backdropFilter: "blur(10px)" }}>
                                <h3 style={{ fontSize: "1.5rem", marginBottom: "0.2rem" }}>4.9/5</h3>
                                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>Success Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div style={{
                    flex: "0 0 500px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4rem 2rem",
                    background: "var(--bg-color)"
                }} className="login-form-container">
                    <div className="animate-fade-in" style={{ width: "100%", maxWidth: "380px" }}>
                        <div style={{ marginBottom: "2.5rem" }}>
                            <h2 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.5rem", color: "var(--text-main)" }}>Welcome back</h2>
                            <p style={{ color: "var(--text-muted)" }}>Enter your details to manage your learning journey</p>
                        </div>

                        {/* Social Logins */}
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                            <button style={{
                                flex: 1,
                                padding: "0.8rem",
                                background: "white",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-main)",
                                fontWeight: "600"
                            }}>
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="G" />
                                Google
                            </button>
                            <button style={{
                                flex: 1,
                                padding: "0.8rem",
                                background: "white",
                                border: "1px solid var(--border)",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-main)",
                                fontWeight: "600"
                            }}>
                                <img src="https://www.svgrepo.com/show/475654/github-color.svg" width="18" alt="G" />
                                GitHub
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>Or email</span>
                            <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
                        </div>

                        {error && <div style={{
                            padding: "1rem",
                            background: "rgba(239, 68, 68, 0.05)",
                            color: "#ef4444",
                            borderRadius: "12px",
                            marginBottom: "1.5rem",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(239, 68, 68, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                        }}>
                            <span>⚠️</span> {error}
                        </div>}

                        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div style={{ textAlign: "left" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>

                            <div style={{ textAlign: "left" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Password</label>
                                    <a href="#" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "600" }}>Forgot password?</a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <input type="checkbox" id="remember" style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
                                <label htmlFor="remember" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Remember me for 30 days</label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    background: "var(--primary)",
                                    color: "white",
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginTop: "0.5rem",
                                    boxShadow: "0 10px 25px var(--primary-glow)",
                                    opacity: loading ? 0.7 : 1,
                                    transition: "var(--transition)"
                                }}
                                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p style={{ marginTop: "2.5rem", fontSize: "0.95rem", color: "var(--text-muted)", textAlign: "center" }}>
                            New to SkillSwap? <Link to="/register" style={{ color: "var(--primary)", fontWeight: "700" }}>Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .login-side-panel { display: none !important; }
                    .login-form-container { flex: 1 !important; padding: 4rem 1.5rem !important; }
                }
                .login-input {
                    width: 100%;
                    padding: 0.9rem 1.2rem;
                    background: var(--surface-color);
                    border: 1px solid var(--border);
                    borderRadius: 12px;
                    color: var(--text-main);
                    outline: none;
                    font-family: inherit;
                    transition: var(--transition);
                }
                .login-input:focus {
                    border-color: var(--primary);
                    background: white;
                    box-shadow: 0 0 0 4px var(--primary-glow);
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>
            <Footer />
        </div>
    );
};

export default Login;
