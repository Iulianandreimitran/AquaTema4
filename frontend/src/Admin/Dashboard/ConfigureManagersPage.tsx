import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Swal from "sweetalert2";


interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
  manager?: { id: number; name: string };
}

interface User {
  id: number;
  name: string;
}

export default function ConfigureManagersPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/hotels/assignable", {
        credentials: "include",
      }).then((res) => res.json()),
      fetch("http://localhost:3000/users/hotel-managers", {
        credentials: "include",
      }).then((res) => res.json()),
    ])
      .then(([hotelData, managerData]) => {
        setHotels(hotelData);
        setManagers(Array.isArray(managerData) ? managerData : []);
      })
      .catch((err) => {
        console.error("Failed to load data", err);
        setHotels([]);
        setManagers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (hotelId: number, managerId: number | null) => {
    try {
        const response = await fetch(`http://localhost:3000/hotels/${hotelId}/assign-manager`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ managerId }), // poate fi și null aici
        });

        if (!response.ok) {
        throw new Error("Failed to assign/unassign manager");
        }

        setHotels((prev) =>
        prev.map((hotel) =>
            hotel.GlobalPropertyID === hotelId
            ? {
                ...hotel,
                manager: managerId
                    ? managers.find((m) => m.id === managerId) || undefined
                    : undefined, // 🔄 dacă e null => scoatem managerul
                }
            : hotel
        )
        );

        await Swal.fire({
        icon: "success",
        title: managerId ? "Manager assigned!" : "Manager removed!",
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        });
    } catch (error) {
        console.error("Error assigning manager:", error);
        Swal.fire("Oops...", "Failed to assign manager. Please try again.", "error");
    }
    };



  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <Header title="Manager Assignment" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Hotels</h2>
        </div>

        <div className="bg-white border rounded-lg shadow-md h-[60vh] overflow-y-auto p-4 space-y-4">
            {hotels.map((hotel) => (
            <div key={hotel.GlobalPropertyID} className="flex justify-between items-center border p-4 rounded">
                <div>
                <h3 className="text-lg font-semibold text-blue-800">{hotel.GlobalPropertyName}</h3>
                <p className="text-sm text-gray-600">
                    Assigned manager: {hotel.manager?.name ?? "Unassigned"}
                </p>
                </div>
                <select
                className="border rounded px-3 py-2"
                value={hotel.manager?.id ?? ""}
                onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return; 
                    const parsed = parseInt(raw, 10);
                    if (parsed === 0) {
                        handleAssign(hotel.GlobalPropertyID, null);
                        return;
                    }
                    if (isNaN(parsed) || parsed <= 0) return;
                    handleAssign(hotel.GlobalPropertyID, parsed);
                }}
                >
                <option value="">— Select Manager —</option>
                {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                    {manager.name}
                    </option>
                ))}
                <option value="0">— Remove Manager —</option>
                </select>
            </div>
            ))}
        </div>
        </div>
    </div>
  );
}
