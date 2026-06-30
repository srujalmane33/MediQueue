function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  required = false,
}) {
  return (
    <div className="mb-5 font-sans">
      {label && (
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-indigo-50/30 border border-indigo-100/80 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
      />
    </div>
  );
}

export default Input;