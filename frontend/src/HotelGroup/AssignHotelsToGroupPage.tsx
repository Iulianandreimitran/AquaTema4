import { useEffect, useState } from "react";
import Header from "../components/Header";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
}

interface HotelGroup {
  id: number;
  name: string;
}

export default function AssignHotelsToGroupPage() {
  const [hotelGroups, setHotelGroups] = useState<HotelGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [availableHotels, setAvailableHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔁 Încarcă toate grupurile
  useEffect(() => {
    fetch("http://localhost:3000/hotel-groups", {
      credentials: "include",
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error("Server error: " + text);
        return JSON.parse(text);
      })
      .then((groups) => {
        if (Array.isArray(groups)) {
          setHotelGroups(groups);
        } else {
          throw new Error("Invalid hotel group response");
        }
      })
      .catch((err) => {
        console.error("Failed to load hotel groups:", err);
        setHotelGroups([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔁 Încarcă hoteluri neasignate doar când e selectat un grup
  useEffect(() => {
    if (!selectedGroupId) {
      setAvailableHotels([]);
      return;
    }

    fetch("http://localhost:3000/hotels/unassigned", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((hotels) => {
        setAvailableHotels(hotels);
      })
      .catch((err) => {
        console.error("Failed to load unassigned hotels:", err);
        setAvailableHotels([]);
      });
  }, [selectedGroupId]);

  // ✅ Asignare hotel într-un grup
  const assignHotel = async (hotelId: number) => {
    if (!selectedGroupId || typeof selectedGroupId !== "number") return;

    try {
      const res = await fetch("http://localhost:3000/hotel-groups/assign-hotel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hotelId, groupId: selectedGroupId }),
      });

      const result = await res.text();
      if (!res.ok) throw new Error("Failed to assign: " + result);

      setAvailableHotels((prev) =>
        prev.filter((h) => h.GlobalPropertyID !== hotelId)
      );

      await Swal.fire({
        icon: "success",
        title: "Hotel assigned!",
        toast: true,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
      });
    } catch (err) {
      console.error("Assignment error:", err);
      Swal.fire("Oops", "Failed to assign hotel. Try again.", "error");
    }
  };

  return (
    <div>
      <Header title="Assign Hotels to Group" />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select Hotel Group</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/create-hotel-group")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              ➕ Create Hotel Group
            </button>
            {selectedGroupId && (
              <button
                onClick={() => navigate(`/edit-hotel-group/${selectedGroupId}`)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
              >
                ✏️ Edit Selected Group
              </button>
            )}
          </div>
        </div>

        <select
          className="border px-3 py-2 rounded mb-6"
          value={selectedGroupId}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            setSelectedGroupId(isNaN(parsed) ? "" : parsed);
          }}
        >
          <option value="">— Select Group —</option>
          {hotelGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <div className="bg-white border rounded shadow p-4 h-[60vh] overflow-y-auto">
          {availableHotels.length === 0 ? (
            <p className="text-gray-600">No unassigned hotels available.</p>
          ) : (
            <ul className="space-y-4">
              {availableHotels.map((hotel) => (
                <li
                  key={hotel.GlobalPropertyID}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="font-medium">{hotel.GlobalPropertyName}</span>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => assignHotel(hotel.GlobalPropertyID)}
                    disabled={!selectedGroupId}
                  >
                    Assign
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
