import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import SkillCard from "../components/SkillCard";
import Footer from "../components/Footer";

const Explore = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const categories = ["All", "Design", "Development", "Business", "Language", "Marketing", "Music"];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.skillsOffered.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === "All" ||
            user.skillsOffered.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));

        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />

            <main className="container" style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>
                <header style={{ marginBottom: "4rem", textAlign: "center" }}>
                    <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>Explore Mentors</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Find the right partner to swap skills with.</p>
                </header>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    marginBottom: "4rem"
                }}>
                    {/* Search Bar */}
                    <div style={{
                        maxWidth: "600px",
                        width: "100%",
                        margin: "0 auto",
                        position: "relative"
                    }}>
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "1.2rem 1.5rem",
                                background: "var(--surface-color)",
                                border: "1px solid var(--border)",
                                borderRadius: "20px",
                                color: "var(--text-main)",
                                fontSize: "1rem",
                                outline: "none",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                            }}
                        />
                        <div style={{ position: "absolute", right: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
                            🔍
                        </div>
                    </div>

                    {/* Categories */}
                    <div style={{
                        display: "flex",
                        gap: "0.8rem",
                        justifyContent: "center",
                        flexWrap: "wrap"
                    }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: "0.6rem 1.5rem",
                                    background: selectedCategory === cat ? "var(--primary)" : "var(--surface-color)",
                                    color: selectedCategory === cat ? "white" : "var(--text-muted)",
                                    borderRadius: "50px",
                                    fontSize: "0.9rem",
                                    fontWeight: "600",
                                    border: "1px solid",
                                    borderColor: selectedCategory === cat ? "var(--primary)" : "var(--border)"
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Loading experts...</div>
                ) : filteredUsers.length > 0 ? (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "2.5rem"
                    }}>
                        {filteredUsers.map(user => (
                            <SkillCard key={user._id} user={user} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "5rem" }}>
                        <h3 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No matches found</h3>
                        <button
                            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                            style={{ color: "var(--primary)", background: "transparent", fontWeight: "600" }}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Explore;
