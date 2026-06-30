import { Lock } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center px-5 font-sans">
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-xl shadow-slate-100/40 w-full max-w-[480px] p-10 flex flex-col">
        {/* Padlock Icon header */}
        <div className="w-16 h-16 bg-blue-50 border border-blue-100/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm shadow-blue-100/5">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 text-center tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-500 text-center text-sm mt-2 mb-8 leading-relaxed max-w-[320px] mx-auto">
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;