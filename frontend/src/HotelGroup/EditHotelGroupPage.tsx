import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Swal from "sweetalert2";

// ✅ Tip pentru hotel (poți extinde dacă ai nevoie de mai multe câmpuri)
interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
}

export default function EditHotelGroupPage() {
  const { id } = useParams();
  const groupId = Number(id);
  const [hotels, setHotels] = useState<Hotel[]>([]);

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
      </div>
    </div>
  );
}
