import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

interface Role {
  id: number;
  name: string;
}

interface UserRole {
  id: number;
  role: Role;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  roles?: string;
}

export default function EditUserPage() {
  const location = useLocation();
  const { id } = useParams();
  const [user, setUser] = useState(location.state?.user);
  const [allRoles, setAllRoles] = useState<Role[]>([]);
  const [roles, setRoles] = useState<number[]>([]);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/users");
  };

  useEffect(() => {
    if (!user) {
      fetch(`http://localhost:3000/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
          setRoles((data.userRoles as UserRole[]).map((ur) => ur.role.id));
        });
    } else {
      setRoles((user.userRoles as UserRole[]).map((ur) => ur.role.id));
    }

    fetch("http://localhost:3000/roles")
      .then((res) => res.json())
      .then(setAllRoles);
  }, [id, user]);

  function validateUserForm(
    user: any,
    password: string,
    roles: number[]
  ): FormErrors {
    const errors: FormErrors = {};

    if (!user.name || user.name.trim().length < 2) {
      errors.name = "Name must be at least 2 char.";
    }

    if (!user.email || !user.email.includes("@")) {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const validationErrors = validateUserForm(user, password, roles);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: any = {
      name: user.name,
      email: user.email,
      roles,
    };

    if (password.trim() !== "") {
      payload.password = password;
    }

    await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate("/users");
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div>
      <Header title="Dashboard" />
      <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">✏️ Edit User</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🧑 Name
            </label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📧 Email
            </label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
          </div>
          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📛 Roles
            </label>
            <div className="grid grid-cols-2 gap-2">
              {allRoles.map((role) => (
                <label
                  key={role.id}
                  className="flex items-center text-sm text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={roles.includes(role.id)}
                    onChange={() =>
                      setRoles((prev) =>
                        prev.includes(role.id)
                          ? prev.filter((r) => r !== role.id)
                          : [...prev, role.id]
                      )
                    }
                    className="mr-2"
                  />
                  {role.name}
                </label>
              ))}
              {errors.roles && (
                <div className="text-red-500 text-sm mt-2">{errors.roles}</div>
              )}
            </div>
          </div>

          {/* Submit */}
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
