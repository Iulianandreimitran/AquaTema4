import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

interface Hotel {
  GlobalPropertyID: number;
  GlobalPropertyName: string;
  final_score?: number;
}

interface CityGroup {
  city: {
    CityID: number;
    CityName: string;
  };
  hotels: Hotel[];
}

const RankedHotelsFlatList: React.FC = () => {
  const [groupedHotels, setGroupedHotels] = useState<CityGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/hotels/grouped-by-city",
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch hotels");

        const data = await response.json();

        setGroupedHotels(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchHotels();
  }, []);

  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div>
      <Header title="Hotel Manager Dashboard" />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">🏨 Hotels Rankings by City</h2>
        <button
          onClick={() => navigate("/hotels/heat-map-ranking")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          🔥 Go to Heatmap
        </button>

        <div className="space-y-10">
          {groupedHotels.map((group) => (
            <div key={group.city.CityID}>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">
                🏙️ {group.city.CityName}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300 border rounded shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Hotel Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Final Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.hotels.map((hotel) => (
                      <tr key={hotel.GlobalPropertyID}>
                        <td className="px-4 py-2">
                          {hotel.GlobalPropertyName}
                        </td>
                        <td className="px-4 py-2">
                          {hotel.final_score !== undefined
                            ? `${hotel.final_score} / 10`
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankedHotelsFlatList;
