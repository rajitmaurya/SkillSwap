import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer style={{
            padding: "3rem 0 2rem",
            background: "var(--surface-color)",
            borderTop: "1px solid var(--border)",
            marginTop: "auto"
        }}>
            <div className="container">
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2.5rem"
                }}>
                    {/* Brand Column */}
                    <div style={{ gridColumn: "span 2" }}>
                        <Link to="/" style={{
                            fontSize: "1.3rem",
                            fontWeight: "800",
                            background: "linear-gradient(to right, var(--primary), var(--secondary))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            display: "inline-block",
                            marginBottom: "1rem"
                        }}>
                            SkillSwap
                        </Link>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: "1.6", maxWidth: "300px" }}>
                            The global community for skill exchange. Connect with experts, share your knowledge, and grow together.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Platform</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            <li><Link to="/explore" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Explore Mentors</Link></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>How it Works</a></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Community Guidelines</a></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Success Stories</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Support</h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Help Center</a></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Contact Us</a></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Terms of Service</a></li>
                            <li><a href="#" style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem"
                }}>
                    <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                        <a href="#" style={{ color: "var(--text-muted)" }}>Twitter</a>
                        <a href="#" style={{ color: "var(--text-muted)" }}>LinkedIn</a>
                        <a href="#" style={{ color: "var(--text-muted)" }}>Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
