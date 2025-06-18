import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useNavigationGuard } from "../../hooks/useNavigationGuard";
import Swal from "sweetalert2";
import { useUnloadGuard } from "../../hooks/useUnloadGuard";
import ErrorText from "../../components/ErrorText";

interface Role {
  id: number;
  name: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  roles?: string;
}

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  useNavigationGuard(isDirty);
  useUnloadGuard(isDirty);

  const handleCancel = () => {
    navigate("/users");
  };
  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserRoles(data.user.roles))
      .catch(() => navigate("/login"))
      .finally(() => setIsLoadingRoles(false));
  }, []);

  useEffect(() => {
    const normalized = userRoles.map((r) => r.toLowerCase().replace(/\s/g, "_"));
    if (!isLoadingRoles && !normalized.includes("administrator")) {
      navigate("/not-authorized");
    }
  }, [userRoles, isLoadingRoles]);

  useEffect(() => {
    fetch("http://localhost:3000/roles", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, []);

  function validateUserForm(
    name: string,
    email: string,
    password: string,
    roles: number[]
  ): FormErrors {
    const errors: FormErrors = {};

    if (!name || name.trim().length < 2) {
      errors.name = "Name must be at least 2 char.";
    }

    if (!email || !email.includes("@")) {
      errors.email = "Invalid email.";
    }

    if (password.length < 6) {
      errors.password = "Password at least 6 chars.";
    }

    if (roles.length === 0) {
      errors.roles = "Select at least one role";
    }

    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateUserForm(
      name,
      email,
      password,
      selectedRoles
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUser = {
      name,
      email,
      password,
      roleIds: selectedRoles,
    };

    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      setIsDirty(false);
      if (!res.ok) {
        throw new Error("Failed to create user");
      }

      await Swal.fire({
        icon: "success",
        title: "User created successfully!",
        showConfirmButton: false,
        timer: 2500,
        toast: true,
        position: "top-end",
      });

      setTimeout(() => {
        navigate("/users");
      }, 500);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Could not create user. Please try again.",
      });
    }
  };

  return (
    <div>
      <Header title="Dashboard" />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto mt-10 space-y-6"
      >
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-blue-700">Create New User</h2>
          <p className="text-sm text-gray-500">Fill in the details below</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            🧑 Name
          </label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none`}
          />
          <ErrorText message={errors.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            📧 Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none`}
          />
        </div>
        <ErrorText message={errors.email} />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            🔒 Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none`}
          />
          <ErrorText message={errors.password} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📛 Roles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => {
                    setSelectedRoles((prev) =>
                      prev.includes(role.id)
                        ? prev.filter((id) => id !== role.id)
                        : [...prev, role.id]
                    );
                    setIsDirty(true);
                    setErrors((prev) => ({ ...prev, roles: undefined }));
                  }}
                />
                <span>{role.name}</span>
              </label>
            ))}
            <ErrorText message={errors.roles} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isDirty}
            className={`px-4 py-2 rounded-md shadow transition 
    ${
      !isDirty
        ? "bg-gray-300 cursor-not-allowed text-gray-500"
        : "bg-green-600 text-white hover:bg-green-700"
    }`}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
