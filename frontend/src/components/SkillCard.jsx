import React, { useState } from "react";
import SwapModal from "./SwapModal";
import { useNavigate } from "react-router-dom";

const SkillCard = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleRequestClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="glass" style={{
                padding: "1.5rem",
                borderRadius: "24px",
                transition: "var(--transition)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
            }} onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.borderColor = "var(--primary)";
            }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--glass-border)";
            }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
                    <img
                        src={user.avatar || `https://i.pravatar.cc/150?u=${user._id}`}
                        alt={user.username}
                        style={{ width: "60px", height: "60px", borderRadius: "20px", objectFit: "cover" }}
                    />
                    <div>
                        <h3 style={{ fontSize: "1.1rem" }}>{user.username}</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{user.title || "Skill Swapper"}</p>
                    </div>
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Offers</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {user.skillsOffered?.map(skill => (
                            <span key={skill} style={{
                                background: "rgba(99, 102, 241, 0.1)",
                                color: "var(--primary)",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "50px",
                                fontSize: "0.8rem",
                                fontWeight: "500"
                            }}>{skill}</span>
                        )) || <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No skills listed</span>}
                    </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>Wants</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {user.skillsWanted?.map(skill => (
                            <span key={skill} style={{
                                background: "rgba(236, 72, 153, 0.1)",
                                color: "var(--secondary)",
                                padding: "0.3rem 0.8rem",
                                borderRadius: "50px",
                                fontSize: "0.8rem",
                                fontWeight: "500"
                            }}>{skill}</span>
                        )) || <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>No interests listed</span>}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRequestClick();
                    }}
                    style={{
                        width: "100%",
                        padding: "0.8rem",
                        background: "var(--surface-hover)",
                        color: "var(--text-main)",
                        borderRadius: "15px",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        border: "1px solid var(--border)"
                    }}
                >
                    Request Swap
                </button>
            </div>

            <SwapModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                receiver={user}
            />
        </>
    );
};

export default SkillCard;
