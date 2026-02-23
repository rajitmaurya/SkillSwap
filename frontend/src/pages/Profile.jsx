import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const fetchProfileAndRequests = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const [profileRes, requestsRes] = await Promise.all([
                axios.get("http://localhost:3000/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:3000/api/swaps/my-requests", {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUser(profileRes.data);
            setFormData(profileRes.data);
            setRequests(requestsRes.data);
        } catch (err) {
            console.error(err);
            localStorage.removeItem("token");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileAndRequests();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await axios.put("http://localhost:3000/api/auth/profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.user);
            setEditing(false);
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Update local storage too
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`http://localhost:3000/api/swaps/status/${requestId}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProfileAndRequests(); // Refresh data
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ paddingTop: "100px", textAlign: "center", color: "var(--text-main)" }}>Loading...</div>;

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className="container" style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem", alignItems: "start" }}>

                    {/* Profile Section */}
                    <div className="glass animate-fade-in" style={{ padding: "2.5rem", borderRadius: "32px", position: "sticky", top: "100px" }}>
                        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                            <img
                                src={user.avatar || `https://i.pravatar.cc/150?u=${user.id}`}
                                alt={user.username}
                                style={{ width: "120px", height: "120px", borderRadius: "40px", objectFit: "cover", border: "4px solid var(--primary)", marginBottom: "1.5rem" }}
                            />
                            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.2rem" }}>{user.username}</h1>
                            <p style={{ color: "var(--primary)", fontWeight: "500", marginBottom: "0.5rem" }}>{user.title}</p>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{user.email}</p>
                        </div>

                        <button
                            onClick={() => setEditing(!editing)}
                            style={{
                                width: "100%",
                                padding: "0.8rem",
                                background: editing ? "var(--surface-hover)" : "var(--primary)",
                                color: "white",
                                borderRadius: "15px",
                                fontWeight: "600",
                                marginBottom: "2rem"
                            }}
                        >
                            {editing ? "Cancel Edit" : "Edit Profile"}
                        </button>

                        {editing && (
                            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                <div>
                                    <label className="label">Username</label>
                                    <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="profile-input" />
                                </div>
                                <div>
                                    <label className="label">Title</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="profile-input" />
                                </div>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </form>
                        )}

                        <div style={{ marginTop: "2rem" }}>
                            <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>My Skills</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {user.skillsOffered?.map(skill => (
                                    <span key={skill} style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", padding: "0.3rem 0.8rem", borderRadius: "50px", fontSize: "0.8rem" }}>{skill}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                navigate("/login");
                            }}
                            style={{
                                marginTop: "3rem",
                                background: "transparent",
                                color: "#ef4444",
                                fontWeight: "600",
                                fontSize: "0.85rem",
                                width: "100%",
                                textAlign: "center"
                            }}
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Requests Section */}
                    <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
                        <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Swap Requests</h2>

                        {requests.length === 0 ? (
                            <div className="glass" style={{ padding: "4rem", borderRadius: "32px", textAlign: "center" }}>
                                <p style={{ color: "var(--text-muted)" }}>No requests yet. Explore and find mentors!</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {requests.map(req => {
                                    const isIncoming = req.receiver._id === user._id;
                                    const otherUser = isIncoming ? req.sender : req.receiver;

                                    return (
                                        <div key={req._id} className="glass" style={{ padding: "1.5rem", borderRadius: "24px", display: "flex", gap: "1.5rem", alignItems: "start" }}>
                                            <img
                                                src={otherUser.avatar || `https://i.pravatar.cc/150?u=${otherUser._id}`}
                                                alt={otherUser.username}
                                                style={{ width: "50px", height: "50px", borderRadius: "15px" }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                                                    <div>
                                                        <h3 style={{ fontSize: "1.1rem" }}>{isIncoming ? "From" : "To"} {otherUser.username}</h3>
                                                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{new Date(req.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span style={{
                                                        padding: "0.3rem 0.8rem",
                                                        borderRadius: "50px",
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        textTransform: "uppercase",
                                                        background: req.status === "pending" ? "rgba(251, 191, 36, 0.1)" : req.status === "accepted" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                                                        color: req.status === "pending" ? "#fbbf24" : req.status === "accepted" ? "#22c55e" : "#ef4444"
                                                    }}>
                                                        {req.status}
                                                    </span>
                                                </div>

                                                <div style={{ display: "flex", gap: "2rem", marginBottom: "1rem" }}>
                                                    <div>
                                                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Teaching</p>
                                                        <p style={{ fontWeight: "600", color: "var(--primary)" }}>{req.skillOffered}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.3rem" }}>Learning</p>
                                                        <p style={{ fontWeight: "600", color: "var(--secondary)" }}>{req.skillWanted}</p>
                                                    </div>
                                                </div>

                                                {req.message && (
                                                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", background: "var(--surface-color)", padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid var(--border)" }}>
                                                        "{req.message}"
                                                    </p>
                                                )}

                                                {isIncoming && req.status === "pending" && (
                                                    <div style={{ display: "flex", gap: "1rem" }}>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "accepted")}
                                                            style={{ padding: "0.6rem 1.5rem", background: "var(--primary)", color: "white", borderRadius: "12px", fontWeight: "600", fontSize: "0.9rem" }}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req._id, "declined")}
                                                            style={{ padding: "0.6rem 1.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "12px", fontWeight: "600", fontSize: "0.9rem" }}
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <style>{`
        .label { display: block; margin-bottom: 0.5rem; color: var(--text-muted); font-size: 0.85rem; margin-left: 0.5rem; }
        .profile-input { width: 100%; padding: 0.8rem; background: var(--surface-hover); border: 1px solid var(--border); border-radius: 12px; color: var(--text-main); outline: none; font-family: inherit; }
        .profile-input:focus { border-color: var(--primary); }
        .save-btn { padding: 0.8rem; background: var(--primary); color: white; border-radius: 12px; font-weight: 600; margin-top: 0.5rem; }
      `}</style>
            <Footer />
        </div>
    );
};

export default Profile;
