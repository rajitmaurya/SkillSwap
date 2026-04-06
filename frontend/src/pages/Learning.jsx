import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Learning = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto mt-12">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Learning Hub</h1>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            Track the skills you are actively learning. Manage your registered sessions and monitor your progress.
          </p>
          <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>
          </div>
          <p className="text-sm font-bold uppercase text-slate-400 tracking-wider">Coming Soon</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Learning;
