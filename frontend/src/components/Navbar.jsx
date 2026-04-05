import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

// Icons
const BellIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>;
const ChevronDownIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const [pendingRequests, setPendingRequests] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        setIsLoggedIn(!!token);

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                api.get("/swaps/my-requests").then(res => {
                    const reqs = res.data;
                    const pendingIncoming = reqs.filter(r => r.receiver?._id === user._id && r.status === "pending");
                    setPendingRequestsCount(pendingIncoming.length);
                    setPendingRequests(pendingIncoming);
                }).catch(e => console.error("Could not fetch requests", e));
            } catch (e) {
                // Ignore parsing errors
            }
        } else {
            setPendingRequestsCount(0);
            setPendingRequests([]);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <nav className="glass" style={{
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: 1000,
            padding: "1rem 0",
            borderBottom: "1px solid var(--glass-border)",
            background: "#ffffff"
        }}>
            <div className="container" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Link to="/" style={{ fontSize: "1.5rem", fontWeight: "800", background: "linear-gradient(to right, var(--primary), var(--secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    SkillSwap
                </Link>

                <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                    <Link to="/explore" style={{ fontSize: "0.9rem", color: location.pathname === "/explore" ? "var(--primary)" : "var(--text-muted)", fontWeight: location.pathname === "/explore" ? "600" : "400" }}>Explore</Link>
                    <a href="#" style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Community</a>

                    {isLoggedIn ? (
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            {/* Service Dropdown */}
                            <div className="relative group cursor-pointer z-50">
                                <div className="flex items-center gap-1 text-[0.9rem] text-[var(--text-muted)] hover:text-indigo-600 font-[400] transition-colors">
                                    Service <ChevronDownIcon className="w-4 h-4 opacity-70" />
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-[1rem] w-36 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden py-1">
                                    <Link to="/teaching" className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Teaching</Link>
                                    <Link to="/learning" className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-pink-600 transition-colors">Learning</Link>
                                </div>
                            </div>
                            
                            {/* Notification Bell Dropdown */}
                            <div className="relative group cursor-pointer z-50">
                                <div className="flex items-center relative text-slate-500 hover:text-indigo-600 transition-colors" title={`${pendingRequestsCount} Pending Requests`}>
                                    <BellIcon className="w-5 h-5" />
                                    {pendingRequestsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm ring-2 ring-rose-500/20 animate-pulse"></span>
                                    )}
                                </div>

                                <div className="absolute top-full right-0 mt-[1rem] w-80 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-1 max-h-[80vh] overflow-y-auto">
                                    <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Notifications <span className="ml-2 bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[9px]">{pendingRequestsCount} New</span></p>
                                    </div>
                                    
                                    {pendingRequestsCount === 0 ? (
                                        <div className="p-8 text-center flex flex-col items-center justify-center">
                                            <BellIcon className="w-8 h-8 text-slate-200 mb-2" />
                                            <p className="text-sm font-medium text-slate-400">All caught up!</p>
                                        </div>
                                    ) : (
                                        pendingRequests.map(r => (
                                            <Link key={r._id} to="/profile" className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group/item">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm ring-2 ring-white">
                                                    {r.sender?.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-800 leading-snug"><span className="font-bold text-slate-900 group-hover/item:text-indigo-600 transition-colors">{r.sender?.username}</span> sent you a swap request!</p>
                                                    <div className="mt-2 flex flex-col gap-1">
                                                        <p className="text-[11px] text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded truncate"><span className="font-bold text-slate-400">Wants:</span> {r.skillWanted}</p>
                                                        <p className="text-[11px] text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded truncate"><span className="font-bold text-slate-400">Offers:</span> {r.skillOffered}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>

                            <Link to="/profile" style={{ fontSize: "0.9rem", color: location.pathname === "/profile" ? "var(--primary)" : "var(--text-muted)", fontWeight: location.pathname === "/profile" ? "600" : "400" }}>Profile</Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "0.5rem 1rem",
                                    background: "rgba(239, 68, 68, 0.1)",
                                    color: "#ef4444",
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    borderRadius: "12px",
                                    fontSize: "0.85rem",
                                    fontWeight: "600"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button style={{
                                padding: "0.6rem 1.8rem",
                                background: "var(--primary)",
                                color: "white",
                                borderRadius: "50px",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                boxShadow: "0 4px 15px var(--primary-glow)"
                            }}>
                                Join Now
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
