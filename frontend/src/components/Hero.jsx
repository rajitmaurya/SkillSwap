import React from "react";

const Hero = () => {
    return (
        <section style={{
            padding: "10rem 0 6rem",
            textAlign: "center",
            background: "radial-gradient(circle at top, rgba(99, 102, 241, 0.1) 0%, transparent 50%)"
        }}>
            <div className="container animate-fade-in">
                <h1 style={{ fontSize: "4rem", lineHeight: "1.1", marginBottom: "1.5rem" }}>
                    Unlock Your Potential <br />
                    <span style={{ color: "var(--primary)" }}>Through Exchange</span>
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
                    The community where experts trade skills. Teach what you love, learn what you need, and grow together.
                </p>
                <div style={{
                    display: "flex",
                    maxWidth: "700px",
                    margin: "0 auto",
                    background: "var(--surface-color)",
                    padding: "0.5rem",
                    borderRadius: "100px",
                    border: "1px solid var(--border)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                }}>
                    <input
                        type="text"
                        placeholder="What skill do you want to learn?"
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            padding: "0 1.5rem",
                            color: "var(--text-main)",
                            fontSize: "1rem",
                            outline: "none"
                        }}
                    />
                    <button style={{
                        background: "var(--primary)",
                        color: "white",
                        padding: "0.8rem 2rem",
                        borderRadius: "100px",
                        fontWeight: "600"
                    }}>
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
