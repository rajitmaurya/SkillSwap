import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Teaching = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto mt-12">
            <h1 className="text-3xl font-black text-slate-900 mb-4">Teaching Hub</h1>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Manage all your upcoming and active teaching sessions here. Share your expertise and help the community grow.
            </p>
            <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">Coming Soon</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teaching;
