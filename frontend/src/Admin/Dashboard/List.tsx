import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`, { state: { user } });
  };

  useEffect(() => {
    fetch(`http://localhost:3000/users?search=${search}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data.users);
        setHasMore(data.hasMore);
      });
  }, [search, page]);

  const handleDelete = async (userId: number) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    setDeletingUserId(userId);

    try {
      await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
      });

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("An error occurred while deleting the user.");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Hei, Dashboard!</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            onClick={() => navigate("/users/create")}
          >
            + Create User
          </button>
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
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                onClick={() => handleEdit(user)}
                key={user.id}
                className="bg-white shadow-md p-4 rounded-lg border border-gray-200 hover:shadow-lg transition flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deletingUserId === user.id}
                  className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-600 px-3 py-1 rounded"
                >
                  {deletingUserId === user.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No users found.</p>
        )}

        <div className="flex items-center justify-between mt-8">
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
