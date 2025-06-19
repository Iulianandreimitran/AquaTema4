import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Swal from "sweetalert2";

interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
}

export default function EditHotelGroupPage() {
  const { id } = useParams();
  const groupId = Number(id);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUserRoles(data.user.roles || []))
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
    fetch(`http://localhost:3000/hotel-groups/${groupId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((group) => {
        setHotels(group.hotels || []);
      });
  }, [groupId]);

  const removeHotel = async (hotelId: number) => {
    const res = await fetch(`http://localhost:3000/hotel-groups/remove-hotel`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelId }),
    });

    if (res.ok) {
      setHotels((prev) =>
        prev.filter((h) => h.GlobalPropertyID !== hotelId)
      );
      Swal.fire("Removed!", "Hotel removed from group.", "success");
    } else {
      Swal.fire("Error", "Could not remove hotel.", "error");
    }
  };

  const removeGroup = async () => {
    const hasHotels = hotels.length > 0;

    const confirm = await Swal.fire({
      title: hasHotels ? "Force delete group?" : "Delete group?",
      text: hasHotels
        ? "This group still has hotels assigned. They will be unlinked automatically."
        : "This will permanently delete the group.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: hasHotels ? "Yes, force delete!" : "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    const endpoint = hasHotels
      ? `http://localhost:3000/hotel-groups/${groupId}/force`
      : `http://localhost:3000/hotel-groups/${groupId}`;

    const res = await fetch(endpoint, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      await Swal.fire("Deleted!", "Hotel group was removed.", "success");
      navigate("/assign-hotels-to-group");
    } else {
      Swal.fire("Error", "Could not delete the group.", "error");
    }
  };

  if (isLoadingRoles) {
    return <p className="text-center mt-10 text-gray-500">Loading access...</p>;
  }

  return (
    <div>
      <Header title="Edit Hotel Group" />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Hotels in Group</h2>
        <ul className="space-y-4">
          {hotels.length === 0 ? (
            <p className="text-gray-600">No hotels assigned.</p>
          ) : (
            hotels.map((hotel) => (
              <li
                key={hotel.GlobalPropertyID}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>{hotel.GlobalPropertyName}</span>
                <button
                  onClick={() => removeHotel(hotel.GlobalPropertyID)}
                  className="text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-100"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="flex justify-end mt-8">
          <button
            onClick={removeGroup}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑 Remove Group
          </button>
        </div>
      </div>
    </div>
  );
}
