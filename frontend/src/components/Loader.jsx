function Loader() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-16 h-16 rounded-full border-4 border-blue-100 animate-pulse"></div>
        {/* Inner spinning ring */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
        Loading MediQueue...
      </h2>
    </div>
  );
}

export default Loader;
