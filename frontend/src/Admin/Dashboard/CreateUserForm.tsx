import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/users");
  };

  useEffect(() => {
    fetch("http://localhost:3000/roles")
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

    if (password && password.length > 0 && password.length < 6) {
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

    console.log(newUser);
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    handleCancel();
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
            onChange={(e) => setName(e.target.value)}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            📧 Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            🔒 Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full mt-1 px-4 py-2 border rounded-md focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
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
                  onChange={() =>
                    setSelectedRoles((prev) =>
                      prev.includes(role.id)
                        ? prev.filter((id) => id !== role.id)
                        : [...prev, role.id]
                    )
                  }
                />
                <span>{role.name}</span>
              </label>
            ))}
            {errors.roles && (
              <p className="text-red-500 text-sm mt-1">{errors.roles}</p>
            )}
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
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
