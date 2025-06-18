import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigationGuard } from "../../hooks/useNavigationGuard";
import Swal from "sweetalert2";
import { useUnloadGuard } from "../../hooks/useUnloadGuard";
import ErrorText from "../../components/ErrorText";

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
    if (!user) {
      fetch(`http://localhost:3000/users/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        });
    }
  }, [id]);

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
    if (user) {
      setRoles((user.userRoles as UserRole[]).map((ur) => ur.role.id));
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:3000/roles", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setAllRoles);
  }, []);

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
    try {
      await fetch(`http://localhost:3000/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      setIsDirty(false);

      await Swal.fire({
        icon: "success",
        title: "User updated successfully!",
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
        text: "Could not update user. Please try again.",
      });
    }
  };

  if (!user)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div>
      <Header title="Dashboard" />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto mt-10 space-y-6"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center sm:text-left">
          ✏️ Edit User
        </h1>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🧑 Name
          </label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <ErrorText message={errors.name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📧 Email
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <ErrorText message={errors.email} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🔒 Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setIsDirty(true);
              setErrors((prev) => ({ ...prev, păassword: undefined }));
            }}
            placeholder="Leave blank to keep current password"
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorText message={errors.password} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📛 Roles
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allRoles.map((role) => (
              <label
                key={role.id}
                className="flex items-center text-sm text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={roles.includes(role.id)}
                  onChange={() => {
                    setRoles((prev) =>
                      prev.includes(role.id)
                        ? prev.filter((r) => r !== role.id)
                        : [...prev, role.id]
                    );
                    setIsDirty(true);
                    setErrors((prev) => ({ ...prev, roles: undefined }));
                  }}
                  className="mr-2"
                />
                {role.name}
              </label>
            ))}
            <ErrorText message={errors.roles} />
          </div>
        </div>

        <div className="flex  justify-end gap-2 pt-4 border-t border-gray-100">
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
            💾 Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
