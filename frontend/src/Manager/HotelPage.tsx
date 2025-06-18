import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
  PropertyAddress1?: string;
  SabrePropertyRating?: number;
  hasFitness?: boolean;
  hasSpa?: boolean;
  hasRelaxArea?: boolean;
  group?: {
    name: string;
  };
}

export default function HotelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth check failed");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Roles received:", data.user.roles);
        setUserRoles(data.user.roles || []);
      })
      .catch((err) => {
        console.error("❌ Failed to get user roles:", err);
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
    const isHotelManager = userRoles.some(
      (role) => role.toLowerCase().replace(/\s/g, "_") === "hotel_manager"
    );


    if (!isLoadingRoles && isHotelManager) {
      console.log("📡 Sending request to /hotels/my-hotels...");

      fetch("http://localhost:3000/hotels/my-hotels", {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Not authenticated");
          return res.json();
        })
        .then((data) => {
          console.log("✅ Hotels received:", data);
          setHotels(data);
        })
        .catch((err) => {
          console.error("❌ Error fetching hotels:", err);
          navigate("/login");
        });
    }

  }, [userRoles, isLoadingRoles]);

  return (
    <div>
      <Header title="Hotel Manager Dashboard" />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Your Assigned Hotels</h2>
        {hotels.length === 0 ? (
          <p className="text-gray-600">No hotels assigned to you.</p>
        ) : (
          <ul className="grid gap-4">
            {hotels.map((hotel) => (
              <li
                key={hotel.GlobalPropertyID}
                className="border p-4 rounded shadow bg-white"
              >
                <h3 className="text-xl font-semibold text-blue-800">
                  {hotel.GlobalPropertyName}
                </h3>
                {hotel.PropertyAddress1 && (
                  <p className="text-gray-600">📍 {hotel.PropertyAddress1}</p>
                )}
                {hotel.group?.name && (
                  <p className="text-sm text-gray-500">🧩 Group: {hotel.group.name}</p>
                )}
                <p className="text-sm text-gray-600">
                  ⭐ Rating: {hotel.SabrePropertyRating ?? "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  🧘‍♂️ Facilities:
                  {hotel.hasFitness && " Fitness,"}
                  {hotel.hasSpa && " Spa,"}
                  {hotel.hasRelaxArea && " Relax Area"}
                  {!hotel.hasFitness && !hotel.hasSpa && !hotel.hasRelaxArea && " None"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
