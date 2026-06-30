function Button({
  children,
  type = "submit",
  loading = false,
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;
