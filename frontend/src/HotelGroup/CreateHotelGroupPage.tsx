import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Swal from "sweetalert2";

export default function CreateHotelGroupPage() {
  const [name, setName] = useState("");
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  const [selectedManager, setSelectedManager] = useState<number | "">("");
  const navigate = useNavigate();

  // 🔁 Fetch manageri (doar cu rolul hotel_manager)
  useEffect(() => {
    fetch("http://localhost:3000/users/hotel-managers", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setManagers)
      .catch((err) => {
        console.error("❌ Failed to fetch managers:", err);
        setManagers([]);
      });
  }, []);

  const handleCreate = async () => {
    if (!name || selectedManager === "") {
      return Swal.fire("Error", "Name and manager are required.", "error");
    }

    try {
      const res = await fetch("http://localhost:3000/hotel-groups", {
        method: "POST",
        credentials: "include", // ✅ trimite JWT-ul (cookie)
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          managerId: selectedManager,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        throw new Error("Failed to create hotel group");
      }

      await Swal.fire({
        icon: "success",
        title: "Group created!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/assign-hotels-to-group");
    } catch (err) {
      console.error("❌ Error creating group:", err);
      Swal.fire("Oops", "Could not create group", "error");
    }
  };

  return (
    <div>
      <Header title="Create Hotel Group" />
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">➕ Create Group</h2>

        <input
          type="text"
          placeholder="Group name"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(Number(e.target.value))}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="">— Select Manager —</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}
