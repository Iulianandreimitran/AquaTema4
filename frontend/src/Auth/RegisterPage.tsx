import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { useUnloadGuard } from "../hooks/useUnloadGuard";
import { useNavigationGuard } from "../hooks/useNavigationGuard";

interface Role {
  id: number;
  name: string;
}

interface RegisterResponse {
  message?: string;
  errorEmail?: string;
  errorRole?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  useNavigationGuard(isDirty);
  useUnloadGuard(isDirty);

  useEffect(() => {
    fetch("http://localhost:3000/roles")
      .then((res) => res.json())
      .then(setRoles);
  }, []);

  const validate = () => {
    const errs: FormErrors = {};
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
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setIsDirty(false);
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
        setTimeout(() => {
          navigate("/login");
        }, 1500);
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
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Register unsuccessful. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden max-w-4xl w-full">
        <div
          className="w-full md:w-1/2 p-6 sm:p-8flex flex-col justify-center mx-auto 
border rounded-xl "
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-12">Sign Up</h2>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
                setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className="w-full border rounded-md px-4 py-2 text-sm "
            />
            <ErrorText message={errors.name} />

            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsDirty(true);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            <ErrorText message={errors.email} />

            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsDirty(true);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            <ErrorText message={errors.password} />

            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setIsDirty(true);
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className="w-full border rounded-md px-4 py-2 text-sm"
            />
            <ErrorText message={errors.confirmPassword} />

            <select
              value={roleId ?? ""}
              onChange={(e) => {
                setRoleId(Number(e.target.value));
                setIsDirty(true);
                setErrors((prev) => ({ ...prev, roleId: undefined }));
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
            <ErrorText message={errors.roleId} />

            <button
              type="submit"
              disabled={!isDirty}
              className={`px-4 py-2 rounded-md shadow transition 
    ${
      !isDirty
        ? "bg-gray-300 cursor-not-allowed text-gray-500 w-full "
        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-md w-full font-semibold"
    }`}
            >
              Submit
            </button>
            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-purple-600 hover:underline cursor-pointer font-medium"
              >
                Log in here
              </span>
            </p>
          </form>
        </div>

        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-500 text-white flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold mb-2">Hey</h1>
          <p className="text-lg font-light">Register here!</p>
        </div>
      </div>
    </div>
  );
}
