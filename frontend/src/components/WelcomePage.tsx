import { useNavigate } from "react-router-dom";


export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Welcome!</h1>
        <p className="text-gray-700 text-lg">
          Thank you for visiting our platform. <br />
          Please sign in or create an account to continue.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md shadow-md transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
