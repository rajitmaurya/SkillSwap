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
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              style={{ width: "60px", height: "60px", borderRadius: "20px", objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "60px",
              height: "60px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              flexShrink: 0
            }}>
              {user.username ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
          )}
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

        <div style={{ display: "flex", gap: "0.8rem" }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRequestClick();
            }}
            style={{
              flex: 1,
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/chat", { state: { userId: user._id } });
            }}
            style={{
              padding: "0.8rem 1.2rem",
              background: "rgba(79, 70, 229, 0.1)",
              color: "var(--primary)",
              borderRadius: "15px",
              fontSize: "0.9rem",
              fontWeight: "600",
              border: "1px solid rgba(79, 70, 229, 0.2)"
            }}
          >
            Message
          </button>
        </div>
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
