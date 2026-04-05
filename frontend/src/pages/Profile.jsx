import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Simple Icon Components
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const DefaultAvatar = ({ name, className = "" }) => {
   const initial = name ? name.charAt(0).toUpperCase() : '?';
   return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold shadow-inner ${className}`}>
         {initial}
      </div>
   );
};

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

const cx = (...classes) => classes.filter(Boolean).join(" ");

const SurfaceCard = ({ className = "", children }) => (
  <div className={cx("bg-white rounded-2xl shadow-sm border border-slate-200", className)}>
    {children}
  </div>
);

const Badge = ({ variant = "indigo", children }) => {
  const styles =
    variant === "indigo"
      ? "bg-indigo-50 text-indigo-700 border-indigo-100"
      : variant === "pink"
        ? "bg-pink-50 text-pink-700 border-pink-100"
        : "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={cx("px-3 py-1 text-sm font-medium rounded-lg border", styles)}>
      {children}
    </span>
  );
};

const StatCard = ({ label, value, accent = "text-slate-900" }) => (
  <SurfaceCard className="p-6">
    <p className="text-sm text-slate-500 font-medium">{label}</p>
    <p className={cx("text-3xl font-bold mt-1", accent)}>{value}</p>
  </SurfaceCard>
);

const Tabs = ({ value, onChange, items }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl">
    {items.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={cx(
          "px-4 py-1.5 text-sm font-semibold rounded-lg transition-all",
          value === tab.value ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
        )}
        type="button"
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const EmptyState = ({ title, description, actionLabel, onAction }) => (
  <div className="text-center py-20 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
    <div className="mx-auto w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-4">
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-80" />
    </div>
    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    <p className="text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
    <button
      onClick={onAction}
      className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
      type="button"
    >
      {actionLabel}
    </button>
  </div>
);

const RequestCard = ({ request, currentUserId, onAccept, onReject }) => {
  const receiverId = request?.receiver?._id;
  const senderId = request?.sender?._id;
  const isIncoming = receiverId && currentUserId && receiverId === currentUserId;
  const otherUser = isIncoming ? request?.sender : request?.receiver;

  const statusColors = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
    declined: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const canAct = isIncoming && request?.status === "pending";

  return (
    <div className="group p-5 rounded-xl border border-slate-100 bg-[#fcfdfe] hover:bg-white hover:border-slate-200 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {otherUser?.avatar ? (
            <img src={otherUser.avatar} alt={otherUser?.username || "User"} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
        ) : (
            <DefaultAvatar name={otherUser?.username} className="w-12 h-12 rounded-xl text-lg shadow-sm" />
        )}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h4 className="font-bold text-slate-900 truncate">
              <span className="text-slate-400 font-normal mr-1">{isIncoming ? "From" : "To"}</span>
              {otherUser?.username || "Unknown"}
            </h4>
            <span
              className={cx(
                "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border",
                statusColors[request?.status] || "bg-slate-100 text-slate-700 border-slate-200"
              )}
            >
              {request?.status || "unknown"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">They want to learn</div>
              <div className="mt-1 font-semibold text-slate-900">{request?.skillWanted || "—"}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-[10px] uppercase font-bold text-slate-400">They offer</div>
              <div className="mt-1 font-semibold text-slate-900">{request?.skillOffered || "—"}</div>
            </div>
          </div>

          {request?.message && (
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
              “{request.message}”
            </p>
          )}

          {canAct && (
            <div className="flex gap-2">
              <button
                onClick={() => onAccept(request._id)}
                className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                type="button"
              >
                Accept
              </button>
              <button
                onClick={() => onReject(request._id)}
                className="px-4 py-1.5 bg-white text-rose-700 border border-rose-200 text-sm font-bold rounded-lg hover:bg-rose-50 transition-colors"
                type="button"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProfile, setEditingProfile] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState("all");
    
    const navigate = useNavigate();

    const fetchProfileAndRequests = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        try {
            const [profileRes, requestsRes] = await Promise.all([
                api.get("/auth/profile"),
                api.get("/swaps/my-requests")
            ]);
            setUser(profileRes.data);
            setFormData({
                username: profileRes.data.username || "",
                title: profileRes.data.title || "",
                bio: profileRes.data.bio || "",
                skillsOffered: profileRes.data.skillsOffered?.join(", ") || "",
                skillsWanted: profileRes.data.skillsWanted?.join(", ") || "",
                avatar: profileRes.data.avatar || ""
            });
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
        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('username', formData.username || '');
            formDataToSubmit.append('title', formData.title || '');
            formDataToSubmit.append('bio', formData.bio || '');
            formDataToSubmit.append('skillsOffered', JSON.stringify((formData.skillsOffered || '').split(',').map(s=>s.trim()).filter(Boolean)));
            formDataToSubmit.append('skillsWanted', JSON.stringify((formData.skillsWanted || '').split(',').map(s=>s.trim()).filter(Boolean)));
            
            if (formData.avatarFile) {
                formDataToSubmit.append('avatarFile', formData.avatarFile);
            } else if (formData.avatar) {
                formDataToSubmit.append('avatarUrl', formData.avatar);
            }

            const res = await api.put("/auth/profile", formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUser(res.data.user);
            setEditingProfile(false);
            localStorage.setItem("user", JSON.stringify(res.data.user)); 
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await api.put(`/swaps/status/${requestId}`, { status });
            fetchProfileAndRequests(); 
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
      <div className="min-h-screen bg-slate-50 flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );

    const filteredRequests = activeTab === "all" 
      ? requests 
      : activeTab === "incoming" 
        ? requests.filter(req => req?.receiver?._id === user?._id) 
        : requests.filter(req => req?.sender?._id === user?._id);

    return (
        <div className="min-h-screen bg-[#f8fafc] font-['Outfit']">
            <Navbar />
            
            {/* SaaS Banner */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-violet-700 w-full" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar: Profile Info */}
                    <div className="lg:col-span-4 space-y-6">
                        <SurfaceCard className="p-6 relative overflow-hidden backdrop-blur-xl bg-white/90 border-white/20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="relative group">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.username} className="w-32 h-32 rounded-[2rem] object-cover ring-4 ring-white/80 shadow-2xl shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-[1.03]" />
                                    ) : (
                                        <DefaultAvatar name={user.username} className="w-32 h-32 rounded-[2rem] text-4xl ring-4 ring-white/80 shadow-2xl shadow-slate-900/20 transition-transform duration-300 group-hover:scale-[1.03]" />
                                    )}
                                    <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-lg shadow border border-slate-100">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">{user.role || 'Member'}</span>
                                    </div>
                                </div>
                                
                                <h1 className="mt-6 text-2xl font-bold text-slate-900">{user.username}</h1>
                                <p className="text-indigo-600 font-medium">{user.title || (user.role === "Mentor" ? "Mentor" : "Member")}</p>
                                <p className="mt-3 text-sm text-slate-600 max-w-sm">
                                  {user.bio || "Add a short bio to help others understand what you’re great at and what you’re learning next."}
                                </p>
                                
                                <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                                  <MailIcon />
                                  <span>{user.email}</span>
                                </div>

                                <button 
                                  onClick={() => setEditingProfile(true)}
                                  className="mt-8 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                                >
                                  <EditIcon />
                                  Edit Profile
                                </button>
                            </div>
                        </SurfaceCard>

                        {/* Skills Section */}
                        <SurfaceCard className="p-6 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center lg:text-left">Skills Offered</h3>
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                    {user.skillsOffered?.length > 0 ? (
                                        user.skillsOffered.map((skill, i) => (
                                          <Badge key={`${skill}-${i}`} variant="indigo">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No skills listed</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 text-center lg:text-left">Skills Wanted</h3>
                                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                    {user.skillsWanted?.length > 0 ? (
                                        user.skillsWanted.map((skill, i) => (
                                          <Badge key={`${skill}-${i}`} variant="pink">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No skills listed</p>
                                    )}
                                </div>
                            </div>
                        </SurfaceCard>
                    </div>

                    {/* Main Content: Stats & Requests */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard label="Skills Offered" value={user.skillsOffered?.length || 0} accent="text-indigo-600" />
                            <StatCard label="Skills Wanted" value={user.skillsWanted?.length || 0} accent="text-pink-600" />
                            <StatCard label="Total Swap Requests" value={requests.length} accent="text-slate-900" />
                        </div>

                        {/* Dashboard Card */}
                        <SurfaceCard className="overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-xl font-bold text-slate-900">Swap Requests</h2>
                                
                                <Tabs
                                  value={activeTab}
                                  onChange={setActiveTab}
                                  items={[
                                    { value: "all", label: "All" },
                                    { value: "incoming", label: "Incoming" },
                                    { value: "outgoing", label: "Outgoing" },
                                  ]}
                                />
                            </div>

                            <div className="p-6">
                                {filteredRequests.length === 0 ? (
                                    <EmptyState
                                      title="No swap requests yet"
                                      description="When someone requests a swap with you (or you request one), it’ll show up here."
                                      actionLabel="Explore Mentors"
                                      onAction={() => navigate("/explore")}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {filteredRequests.map((req) => (
                                          <RequestCard
                                            key={req._id}
                                            request={req}
                                            currentUserId={user?._id}
                                            onAccept={(id) => handleStatusUpdate(id, "accepted")}
                                            onReject={(id) => handleStatusUpdate(id, "declined")}
                                          />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </SurfaceCard>
                    </div>
                </div>
            </main>

            {/* Edit Modal / Slide-over could be here - for now using a quick simple overlay */}
            {editingProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 self-center">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Edit Profile</h3>
                    <button onClick={() => setEditingProfile(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
                  </div>
                  <form onSubmit={handleUpdate} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Username</label>
                        <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" required />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Title</label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Bio</label>
                        <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-24" placeholder="A short intro about you…" />
                    </div>
                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Profile Picture</label>
                        <div className="flex flex-col gap-3">
                           <div className="flex items-center gap-4">
                               <div className="shrink-0">
                                   {formData.avatarFile ? (
                                       <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-500 font-bold text-xs uppercase tracking-wider overflow-hidden">
                                           <img src={URL.createObjectURL(formData.avatarFile)} className="w-full h-full object-cover" alt="preview" />
                                       </div>
                                   ) : user.avatar ? (
                                       <img src={user.avatar} className="w-16 h-16 rounded-2xl object-cover border border-slate-200" alt="current" />
                                   ) : (
                                       <DefaultAvatar name={formData.username} className="w-16 h-16 rounded-2xl text-xl" />
                                   )}
                               </div>
                               <div className="relative flex-1">
                                   <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, avatarFile: e.target.files[0] })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                   <div className="w-full px-4 py-3 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-sm flex items-center justify-center transition-all shadow-sm">
                                       {formData.avatarFile ? `Selected: ${formData.avatarFile.name}` : "Upload New Image"}
                                   </div>
                               </div>
                           </div>
                        </div>
                    </div>
                    <div className="space-y-1 pt-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Skills Offered (comma separated)</label>
                        <textarea value={formData.skillsOffered} onChange={(e) => setFormData({ ...formData, skillsOffered: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-20" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Skills Wanted (comma separated)</label>
                        <textarea value={formData.skillsWanted} onChange={(e) => setFormData({ ...formData, skillsWanted: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-20" />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setEditingProfile(false)} className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <Footer />
        </div>
    );
};

export default Profile;
