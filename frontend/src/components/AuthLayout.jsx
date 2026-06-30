function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-5">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center">
          {title}
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          {subtitle}
        </p>

        {children}

      </div>
    </div>
  );
}

export default AuthLayout;