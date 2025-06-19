import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const navigate = useNavigate();

  const normalizedRoles = userRoles.map(r => r.toLowerCase().replace(/\s/g, "_"));
  const isReadOnly = normalizedRoles.includes("hotel_manager") && normalizedRoles.length === 1;

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserRoles(data.user.roles);
      })
      .catch(() => {
        setUserRoles([]);
      })
      .finally(() => {
        setIsLoadingRoles(false);
      });
  }, []);

  useEffect(() => {
    const restricted = userRoles.some((role) =>
      ["traveler", "data_operator"].includes(role.toLowerCase().replace(/\s/g, "_"))
    );

    if (!isLoadingRoles && restricted) {
      navigate("/not-authorized");
    }
  }, [userRoles, isLoadingRoles]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    fetch(`http://localhost:3000/users?search=${debouncedSearch}&page=${page}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
        setHasMore(data.hasMore);
      });
  }, [debouncedSearch, page]);

  const handleEdit = (user: User) => {
    if (!isReadOnly) {
      navigate(`/users/${user.id}/edit`, { state: { user } });
    }
  };

  const handleDelete = async (userId: number) => {
    if (isReadOnly) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setDeletingUserId(userId);

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        if (error.message?.includes("assigned as manager")) {
          Swal.fire(
            "Blocked",
            "This user manages a hotel group and cannot be deleted.",
            "warning"
          );
        } else {
          Swal.fire("Error", "Failed to delete user.", "error");
        }
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "User has been deleted.",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete user.",
      });
    } finally {
      setDeletingUserId(null);
    }

  };

  if (isLoadingRoles) {
    return <p className="text-center text-gray-500 mt-8">Loading roles...</p>;
  }

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hei, Dashboard!</h1>
          {!isReadOnly && (
            <div className="flex gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
                onClick={() => navigate("/users/create")}
              >
                + Create User
              </button>

              <button
                onClick={() => navigate("/assign-hotels-to-group")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
              >
                🧩 Configure Hotel Groups
              </button>

              <button
                onClick={() => navigate("/users/configure-managers")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
              >
                ⚙️ Configure Managers
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="🔍 Search users by name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {users.length > 0 ? (
          <div className="p-6 max-w-4xl mx-auto flex flex-col relative h-[50vh]">
            <div className="overflow-y-auto flex-1">
              {users.map((user) => (
                <div
                  onClick={() => handleEdit(user)}
                  key={user.id}
                  className={`bg-white shadow-md p-4 rounded-lg border border-gray-200 transition flex justify-between items-center ${
                    isReadOnly ? "cursor-default" : "hover:shadow-lg cursor-pointer"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(user.id);
                      }}
                      disabled={deletingUserId === user.id}
                      className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-600 px-3 py-1 rounded"
                    >
                      {deletingUserId === user.id ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}

        <div className="sticky bottom-0 bg-white pt-4 mt-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded text-white font-medium transition-colors duration-200 ${
              page === 1
                ? "bg-gray-400 cursor-not-allowed opacity-50 pointer-events-none"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">Page {page}</span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
            className={`px-4 py-2 rounded text-white font-medium transition-colors duration-200 ${
              hasMore
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed opacity-50 pointer-events-none"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
