import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Role {
  id: number;
  name: string;
}

interface RegisterResponse {
  message?: string;
  errorEmail?: string;
  errorRole?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.includes("@")) errs.email = "Invalid email";
    if (password.length < 6) errs.password = "Password too short";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords don't match";
    if (!roleId) errs.roleId = "Role is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { name, email, password, roleId };

    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: RegisterResponse = await res.json();

    if (data.message) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data.message,
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        position: "top-end",
      });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRoleId(null);
      setErrors({});
    } else {
      const newErrors: { [key: string]: string } = {};

      if (data.errorEmail) newErrors.email = data.errorEmail;
      if (data.errorRole) newErrors.roleId = data.errorRole;

      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex shadow-lg rounded-xl overflow-hidden max-w-4xl w-full bg-white">
        <div className="w-1/2 p-8 bg-white flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-12">Sign Up</h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full border rounded-md px-4 py-2 text-sm "
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}

            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
            )}

            <select
              value={roleId ?? ""}
              onChange={(e) => {
                setRoleId(Number(e.target.value));
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId && (
              <p className="text-red-500 text-xs">{errors.roleId}</p>
            )}

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md w-full font-semibold"
              onClick={() => navigate("/login")}              
            >
              Submit
            </button>
          </form>
        </div>

        <div className="w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold mb-2">Hey</h1>
          <p className="text-lg font-light">Register here!</p>
        </div>
      </div>
    </div>
  );
}
