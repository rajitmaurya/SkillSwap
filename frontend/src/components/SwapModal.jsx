import React, { useState } from "react";
import api from "../api/axios";

const SwapModal = ({ isOpen, onClose, receiver }) => {
    const [skillOffered, setSkillOffered] = useState("");
    const [skillWanted, setSkillWanted] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/swaps/request", {
                receiverId: receiver._id,
                skillOffered,
                skillWanted,
                message
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem"
        }}>
            <div className="glass animate-fade-in" style={{
                width: "100%",
                maxWidth: "500px",
                padding: "2.5rem",
                borderRadius: "32px",
                position: "relative"
            }}>
                <button onClick={onClose} style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "1.5rem"
                }}>×</button>

                {success ? (
                    <div style={{ textAlign: "center", padding: "2rem" }}>
                        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                        <h2 style={{ marginBottom: "0.5rem" }}>Request Sent!</h2>
                        <p style={{ color: "var(--text-muted)" }}>We'll notify you when {receiver.username} responds.</p>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>Swap with {receiver.username}</h2>
                        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Propose a skill exchange to start collaborating.</p>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>Skill you'll teach</label>
                                <select
                                    className="modal-input"
                                    value={skillOffered}
                                    onChange={(e) => setSkillOffered(e.target.value)}
                                    required
                                >
                                    <option value="">Select a skill</option>
                                    {(JSON.parse(localStorage.getItem("user"))?.skillsOffered || []).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>Skill you want to learn</label>
                                <select
                                    className="modal-input"
                                    value={skillWanted}
                                    onChange={(e) => setSkillWanted(e.target.value)}
                                    required
                                >
                                    <option value="">Select a skill</option>
                                    {receiver.skillsOffered.map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>Message (Optional)</label>
                                <textarea
                                    className="modal-input"
                                    placeholder="Tell them why you'd like to swap..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows="3"
                                    style={{ resize: "none" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "1rem",
                                    background: "var(--primary)",
                                    color: "white",
                                    borderRadius: "16px",
                                    fontWeight: "600",
                                    fontSize: "1rem",
                                    marginTop: "1rem",
                                    boxShadow: "0 10px 20px var(--primary-glow)",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "Sending..." : "Send Request"}
                            </button>
                        </form>
                    </>
                )}
            </div>

            <style>{`
        .modal-input {
          width: 100%;
          padding: 1rem;
          background: var(--surface-color);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-main);
          margin-top: 0.5rem;
          outline: none;
          font-family: inherit;
        }
        .modal-input:focus {
          border-color: var(--primary);
        }
      `}</style>
        </div>
    );
};

export default SwapModal;
