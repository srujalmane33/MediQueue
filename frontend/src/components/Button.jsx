function Button({
  children,
  type = "submit",
  loading = false,
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold py-3.5 rounded-xl transition duration-200 shadow-md shadow-indigo-600/10 active:scale-98 disabled:opacity-50 text-sm tracking-wide"
    >
      {loading ? "Signing in..." : children}
    </button>
  );
}

export default Button;
