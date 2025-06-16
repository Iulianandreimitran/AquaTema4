import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.name);
      setRoles(user.roles || []);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm mb-2">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        {userName && (
          <div className="text-right">
            <p className="text-gray-700 font-medium">Salut, {userName}</p>
            <p className="text-xs text-gray-500">
              Rolul: {roles.join(", ")}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}