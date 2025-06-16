import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.includes("@")) errs.email = "Email invalid";
    if (password.length < 6) errs.password = "Parolă prea scurtă";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setErrors({ general: "Email sau parolă greșită" });
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    Swal.fire({
      icon: "success",
      title: "Bine ai venit!",
      text: `Salut, ${data.user.name}!`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-end",
    });

    navigate("/users");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex shadow-lg rounded-xl overflow-hidden max-w-4xl w-full bg-white">
        {/* LEFT - FORMULAR */}
        <div className="w-1/2 p-8 bg-white flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-12">Login</h2>

            {errors.general && (
              <p className="text-red-500 text-sm">{errors.general}</p>
            )}

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md w-full font-semibold"
            >
              Login
            </button>

            <p className="text-sm text-gray-600 text-center pt-2">
              Nu ai cont?{" "}
              <span
                className="text-purple-600 hover:underline cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Înregistrează-te
              </span>
            </p>
          </form>
        </div>

        {/* RIGHT - IMAGINE / FUNDAL */}
        <div className="w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold mb-2">Hello!</h1>
          <p className="text-lg font-light">Sign in to continue.</p>
        </div>
      </div>
    </div>
  );
}
