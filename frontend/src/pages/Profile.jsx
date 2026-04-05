import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Clean UI Icons
const SparkleIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>;
const BookIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>;
const BellIcon = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

const DefaultAvatar = ({ name, className = "" }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-inner ${className}`}>
      {initial}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("all");

  // Restored State for Editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.get("/auth/profile");
        const reqs = await api.get("/swaps/my-requests");

        setUser(profile.data);
        setFormData({
          username: profile.data.username || "",
          title: profile.data.title || "",
          bio: profile.data.bio || "",
          skillsOffered: profile.data.skillsOffered?.join(", ") || "",
          skillsWanted: profile.data.skillsWanted?.join(", ") || "",
          avatar: profile.data.avatar || ""
        });
        setRequests(reqs.data);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('username', formData.username || '');
      formDataToSubmit.append('title', formData.title || '');
      formDataToSubmit.append('bio', formData.bio || '');
      formDataToSubmit.append('skillsOffered', JSON.stringify((formData.skillsOffered || '').split(',').map(s => s.trim()).filter(Boolean)));
      formDataToSubmit.append('skillsWanted', JSON.stringify((formData.skillsWanted || '').split(',').map(s => s.trim()).filter(Boolean)));

      if (formData.avatarFile) {
        formDataToSubmit.append('avatarFile', formData.avatarFile);
      } else if (formData.avatar) {
        formDataToSubmit.append('avatarUrl', formData.avatar);
      }

      const res = await api.put("/auth/profile", formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
      const reqs = await api.get("/swaps/my-requests");
      setRequests(reqs.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter requests based on tabs
  const filteredRequests = activeTab === "all" ? requests : activeTab === "incoming" ? requests.filter(req => req?.receiver?._id === user?._id) : requests.filter(req => req?.sender?._id === user?._id);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

        {/* 🌟 FULL-WIDTH PROFILE HEADER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Cover Photo */}
          <div className="h-40 sm:h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div className="px-6 sm:px-10 pb-8">
            {/* Avatar & Action Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 -mt-16 sm:-mt-20 relative z-10 text-center sm:text-left">
              <div className="flex flex-col items-center sm:flex-row sm:items-end gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="shrink-0 inline-block relative mx-auto sm:mx-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover ring-4 ring-white shadow-md bg-white relative z-10 mx-auto sm:mx-0"
                    />
                  ) : (
                    <DefaultAvatar name={user.username} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full text-5xl ring-4 ring-white shadow-md bg-white border border-slate-100 relative z-10 mx-auto sm:mx-0" />
                  )}
                </div>
                <div className="mb-2 mt-2 sm:mt-0">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{user.username}</h2>
                  <p className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold uppercase tracking-wider text-[10px] mt-2 sm:mt-1">{user.title || "Member"}</p>
                </div>
              </div>

              <div className="shrink-0 mb-2 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => setEditingProfile(true)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Bio & Contact Details */}
            <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6">
              <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                {user.bio || "Add a short bio to help others understand your expertise and what you're passionate about learning."}
              </p>

              <div className="shrink-0">
                <p className="text-sm font-medium text-slate-500 bg-slate-50 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200">
                  <svg className="w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* 👤 LEFT SIDEBAR - Skills Block */}
          <div className="lg:col-span-4 space-y-8">
            {/* SKILLS */}
            <div className="px-6 py-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-sm">
              <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><SparkleIcon className="w-3.5 h-3.5 text-indigo-400" /> Skills Offered</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {user.skillsOffered?.length > 0 ? user.skillsOffered.map((s, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm">
                    {s}
                  </span>
                )) : <p className="text-xs text-slate-400 italic">None specified</p>}
              </div>

              <div className="pt-6 border-t border-slate-200/60">
                <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5"><BookIcon className="w-3.5 h-3.5 text-pink-400" /> Learning Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted?.length > 0 ? user.skillsWanted.map((s, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-bold rounded-lg bg-pink-100 text-pink-700 border border-pink-200 shadow-sm">
                      {s}
                    </span>
                  )) : <p className="text-xs text-slate-400 italic">None specified</p>}
                </div>
              </div>
            </div>
          </div>

          {/* 📊 RIGHT SIDE */}
          <div className="lg:col-span-8 space-y-8">

            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden group w-full lg:w-1/3">
                <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full blur-2xl transition-all duration-500 group-hover:bg-indigo-500/30"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                    <BellIcon className="w-5 h-5 text-indigo-300" />
                  </div>
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Requests</p>
                </div>
                <h2 className="text-4xl font-black text-white relative z-10">{requests.length} <span className="text-lg font-bold text-slate-400">Total</span></h2>
              </div>
            </div>

            {/* REQUESTS DASHBOARD */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h3 className="font-black text-2xl text-slate-900">Connections Hub</h3>

                {/* Clean Tab Navigator */}
                <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/60">
                  {['all', 'incoming', 'outgoing'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="text-center py-20 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <BellIcon className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold mb-1">No {activeTab !== 'all' ? activeTab : ''} requests found</p>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">When someone requests a swap with you (or you request one), it will appear here.</p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 hover:text-indigo-600 shadow-sm transition-all"
                  >
                    Find Mentors
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((r) => {
                    const isIncoming = r?.receiver?._id === user?._id;
                    const canAct = isIncoming && r.status === "pending";
                    const otherPerson = isIncoming ? r?.sender : r?.receiver;

                    return (
                      <div key={r._id} className="p-1 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                        <div className="p-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row gap-5 items-start">
                          {/* Avatar */}
                          <div className="shrink-0">
                            {otherPerson?.avatar ? (
                              <img src={otherPerson.avatar} className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-100" alt="Avatar" />
                            ) : (
                              <DefaultAvatar name={otherPerson?.username} className="w-14 h-14 rounded-full text-lg border border-slate-100" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 w-full min-w-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs font-bold uppercase text-slate-400 mb-0.5">{isIncoming ? "Incoming from" : "Sent to"}</p>
                                <p className="font-bold text-lg text-slate-900 truncate">{otherPerson?.username || "Unknown User"}</p>
                              </div>
                              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${r.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                r.status === 'declined' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                {r.status}
                              </span>
                            </div>

                            <div className="flex flex-col xs:flex-row sm:items-center gap-3 mt-3 text-sm">
                              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">They want to learn</p>
                                <p className="font-medium text-slate-800">{r.skillWanted}</p>
                              </div>
                              <div className="shrink-0 text-slate-300 hidden sm:block">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                              </div>
                              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 w-full">
                                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1">They offer</p>
                                <p className="font-medium text-slate-800">{r.skillOffered}</p>
                              </div>
                            </div>

                            {canAct && (
                              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                <button onClick={() => handleStatusUpdate(r._id, "accepted")} className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-sm">Accept Request</button>
                                <button onClick={() => handleStatusUpdate(r._id, "declined")} className="px-5 py-2 bg-white text-rose-600 border border-slate-200 text-sm font-bold rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-colors">Decline</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Restored Responsive Edit User Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
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
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md">Save Changes</button>
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