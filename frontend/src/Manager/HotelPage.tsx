import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
  PropertyAddress1?: string;
  SabrePropertyRating?: number;
  hasLocker?: boolean;
  hasFitness?: boolean;
  hasRelaxArea?: boolean;
  hasTurkishBath?: boolean;
  hasSpa?: boolean;
  hasFitnessRoom?: boolean;
  hasSauna?: boolean;
  group?: { name: string };
  cleanliness_score?: number;
  food_score?: number;
  sleep_score?: number;
  internet_score?: number;
  amenities_score?: number;
  final_score?: number;
}

export default function HotelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Auth check failed");
        return res.json();
      })
      .then((data) => {
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
      ["traveler", "data_operator"].includes(
        role.toLowerCase().replace(/\s/g, "_")
      )
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
      Promise.all([
        fetch("http://localhost:3000/hotels/my-hotels", { credentials: "include" }).then((res) => res.json()),
        fetch("http://localhost:3000/hotels/group-hotels", { credentials: "include" }).then((res) => res.json())
      ])
        .then(([myHotels, groupHotels]) => {
          const combined = [...(myHotels || []), ...(groupHotels || [])];
          const unique = combined.filter(
            (hotel, index, self) =>
              index === self.findIndex((h) => h.GlobalPropertyID === hotel.GlobalPropertyID)
          );
          setHotels(unique);
        })
        .catch((err) => {
          console.error("❌ Error loading hotels:", err);
        });
    }
  }, [userRoles, isLoadingRoles]);

  return (
    <div>
      <Header title="Hotel Manager Dashboard" />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          🏨 Your Assigned Hotels
        </h2>

        {hotels.length === 0 ? (
          <p className="text-gray-600 text-lg">No hotels assigned to you.</p>
        ) : (
          <ul className="grid gap-6">
            {hotels.map((hotel) => (
              <li
                key={hotel.GlobalPropertyID}
                className="border p-6 rounded-xl shadow-md bg-white space-y-2"
              >
                <h3 className="text-2xl font-semibold text-blue-900">
                  {hotel.GlobalPropertyName}
                </h3>

                {hotel.PropertyAddress1 && (
                  <p className="text-base text-gray-700">
                    📍 {hotel.PropertyAddress1}
                  </p>
                )}

                {hotel.group?.name && (
                  <p className="text-base text-gray-500">
                    🧩 Group: {hotel.group.name}
                  </p>
                )}

                <div className="mt-2 space-y-1 text-base text-gray-700">
                  <p>
                    🧹 <strong>Cleanliness:</strong>{" "}
                    {hotel.cleanliness_score ?? "N/A"} / 10
                  </p>
                  <p>
                    🍽️ <strong>Food:</strong> {hotel.food_score ?? "N/A"} / 10
                  </p>
                  <p>
                    🛌 <strong>Sleep:</strong> {hotel.sleep_score ?? "N/A"} / 10
                  </p>
                  <p>
                    🌐 <strong>Internet:</strong>{" "}
                    {hotel.internet_score ?? "N/A"} / 10
                  </p>
                  <p>
                    🛎️ <strong>Amenities:</strong>{" "}
                    {hotel.amenities_score ?? "N/A"} / 10
                  </p>
                  <p>
                    📊 <strong className="text-blue-800">Final Score:</strong>{" "}
                    <span className="text-lg font-bold text-blue-700">
                      {hotel.final_score ?? "N/A"} / 10
                    </span>
                  </p>
                </div>

                <p className="mt-3 text-base text-gray-700">
                  🧘‍♂️ <strong>Facilities:</strong>{" "}
                  {(hotel.hasFitness && "Fitness, ") || ""}
                  {(hotel.hasSpa && "Spa, ") || ""}
                  {(hotel.hasRelaxArea && "Relax Area, ") || ""}
                  {(hotel.hasTurkishBath && "Turkish Bath, ") || ""}
                  {(hotel.hasLocker && "Locker, ") || ""}
                  {(hotel.hasFitnessRoom && "Fitness Room, ") || ""}
                  {(hotel.hasSauna && "Sauna") || ""}
                  {!hotel.hasFitness &&
                    !hotel.hasSpa &&
                    !hotel.hasRelaxArea &&
                    !hotel.hasTurkishBath &&
                    !hotel.hasLocker &&
                    !hotel.hasFitnessRoom &&
                    !hotel.hasSauna &&
                    "None"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
