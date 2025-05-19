import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("email", email);
    window.location.href = "/dashboard";
  };

  return (
    <div className="bg-gray-100 w-full h-full">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Entrar</h2>
        <form onSubmit={handleSubmit}>
          {/* 1. mb-4 on this div */}
          <div className="mb-4 flex items-center">
            {/* 2. mr-2 on label */}
            <label className="text-gray-700 mr-2">Email</label>
            {/* 3. mr-2 on input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
              placeholder="test1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mb-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );

}