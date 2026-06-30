import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <div>

          <h1 className="text-5xl font-bold leading-tight">
            Book Hospital Appointments
            <span className="text-blue-600">
              {" "}Without Waiting
            </span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg">

            Check doctor availability,
            view live crowd status,
            and reserve your appointment in minutes.

          </p>

          <div className="flex gap-4 mt-8">

            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Get Started
            </Link>

            <Link
              to="/doctor/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg"
            >
              Doctor Portal
            </Link>

          </div>

        </div>

        <div className="flex justify-center">

          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=700"
            alt="Hospital"
            className="rounded-xl shadow-lg"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;