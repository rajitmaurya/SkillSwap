import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SkillCard from "../components/SkillCard";
import Footer from "../components/Footer";

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/users");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Mock data if backend is empty
    const displayUsers = users.length > 0 ? users : [
        {
            _id: "1",
            username: "Alex Rivera",
            title: "UI/UX Designer",
            avatar: "https://i.pravatar.cc/150?u=1",
            skillsOffered: ["Figma", "Branding", "UI Design"],
            skillsWanted: ["React", "Node.js"]
        },
        {
            _id: "2",
            username: "Sarah Chen",
            title: "Fullstack Developer",
            avatar: "https://i.pravatar.cc/150?u=2",
            skillsOffered: ["React", "Python", "SQL"],
            skillsWanted: ["Illustration", "English"]
        },
        {
            _id: "3",
            username: "Marcus Thorne",
            title: "Marketing Lead",
            avatar: "https://i.pravatar.cc/150?u=3",
            skillsOffered: ["SEO", "AdWords", "Copywriting"],
            skillsWanted: ["Video Editing", "French"]
        },
        {
            _id: "4",
            username: "Elena Gomez",
            title: "Digital Artist",
            avatar: "https://i.pravatar.cc/150?u=4",
            skillsOffered: ["Procreate", "Photoshop"],
            skillsWanted: ["Personal Finance", "React"]
        }
    ];

    return (
        <div style={{ minHeight: "100vh" }}>
            <Navbar />
            <Hero />

            <section className="container" style={{ paddingBottom: "10rem" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "3rem"
                }}>
                    <div>
                        <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>Experts for you</h2>
                        <p style={{ color: "var(--text-muted)" }}>Based on your interests and recent activity.</p>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button style={{ background: "transparent", color: "var(--text-muted)", fontSize: "0.9rem" }}>Design</button>
                        <button style={{ background: "transparent", color: "var(--text-muted)", fontSize: "0.9rem" }}>Development</button>
                        <button style={{ background: "transparent", color: "var(--text-muted)", fontSize: "0.9rem" }}>Language</button>
                        <button style={{ background: "var(--primary)", color: "white", padding: "0.4rem 1rem", borderRadius: "50px", fontSize: "0.9rem" }}>All</button>
                    </div>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "2rem"
                }}>
                    {displayUsers.map(user => (
                        <SkillCard key={user._id} user={user} />
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
