import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        title: "",
        skillsOffered: "",
        skillsWanted: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const data = {
            ...formData,
            skillsOffered: formData.skillsOffered.split(",").map(s => s.trim()).filter(s => s),
            skillsWanted: formData.skillsWanted.split(",").map(s => s.trim()).filter(s => s)
        };

        try {
            await api.post("/auth/register", data);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
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
                alignItems: "stretch",
                background: "var(--bg-color)"
            }}>
                {/* Left Side: Register Sidebar */}
                <div style={{
                    flex: 1,
                    background: "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "4rem",
                    color: "white",
                    position: "relative",
                    overflow: "hidden"
                }} className="register-side-panel">
                    {/* Decorative Elements */}
                    <div style={{
                        position: "absolute",
                        top: "20%",
                        left: "-10%",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        filter: "blur(70px)"
                    }}></div>

                    <div style={{ position: "relative", zIndex: 1 }} className="animate-fade-in">
                        <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "1.5rem", lineHeight: "1.1" }}>
                            Your Journey<br />Starts Here.
                        </h1>
                        <p style={{ fontSize: "1.2rem", opacity: 0.9, maxWidth: "450px", marginBottom: "3rem", lineHeight: "1.6" }}>
                            Create your profile and start connecting with thousands of people who want to share their expertise with you.
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                                <p style={{ fontWeight: "500" }}>Verified Expert Community</p>
                            </div>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                                <p style={{ fontWeight: "500" }}>Direct 1-on-1 Mentorship</p>
                            </div>
                            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                                <p style={{ fontWeight: "500" }}>Unlimited Skill Swaps</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div style={{
                    flex: "0 0 650px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4rem 2rem",
                    background: "var(--bg-color)"
                }} className="register-form-container">
                    <div className="animate-fade-in" style={{ width: "100%", maxWidth: "500px" }}>
                        <div style={{ marginBottom: "2.5rem", textAlign: "left" }}>
                            <h2 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "0.5rem", color: "var(--text-main)" }}>Create account</h2>
                            <p style={{ color: "var(--text-muted)" }}>Join the most active skill exchange community</p>
                        </div>

                        {error && <div style={{
                            padding: "1rem",
                            background: "rgba(239, 68, 68, 0.05)",
                            color: "#ef4444",
                            borderRadius: "12px",
                            marginBottom: "1.5rem",
                            fontSize: "0.85rem",
                            border: "1px solid rgba(239, 68, 68, 0.1)"
                        }}>
                            {error}
                        </div>}

                        <form onSubmit={handleRegister} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", textAlign: "left" }}>
                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Full Name</label>
                                <input name="username" placeholder="Alex Rivera" onChange={handleChange} required className="register-input" />
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Email Address</label>
                                <input name="email" type="email" placeholder="alex@example.com" onChange={handleChange} required className="register-input" />
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Professional Title</label>
                                <input name="title" placeholder="UI/UX Designer" onChange={handleChange} required className="register-input" />
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Skills to Teach</label>
                                <input name="skillsOffered" placeholder="Figma, Design" onChange={handleChange} required className="register-input" />
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Skills to Learn</label>
                                <input name="skillsWanted" placeholder="React, Node" onChange={handleChange} required className="register-input" />
                            </div>

                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "0.5rem", display: "block" }}>Password</label>
                                <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required className="register-input" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    gridColumn: "span 2",
                                    padding: "1rem",
                                    background: "var(--primary)",
                                    color: "white",
                                    borderRadius: "12px",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginTop: "1rem",
                                    boxShadow: "0 10px 25px var(--primary-glow)",
                                    opacity: loading ? 0.7 : 1,
                                    transition: "var(--transition)"
                                }}
                                onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>
                        </form>

                        <p style={{ marginTop: "2.5rem", fontSize: "0.95rem", color: "var(--text-muted)", textAlign: "center" }}>
                            Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "700" }}>Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1100px) {
                    .register-side-panel { display: none !important; }
                    .register-form-container { flex: 1 !important; padding: 4rem 1.5rem !important; }
                }
                .register-input {
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
                .register-input:focus {
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

export default Register;
