import { useEffect, useState } from "react";
import Header from "../components/Header";
import Chart from "react-apexcharts";

interface HeatmapCity {
  city: {
    CityID: number;
    CityName: string;
  };
  averageScore: number;
}

export default function HeatMapPage()  {
  const [heatmapData, setHeatmapData] = useState<HeatmapCity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch("http://localhost:3000/hotels/heatmap-data", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch heatmap data");

        const data = await res.json();
        setHeatmapData(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchHeatmap();
  }, []);

  if (error) return <p className="text-red-600 p-4">Error: {error}</p>;

  const series = [
    {
      name: "Ranking Score",
      data: heatmapData.map((city) => ({
        x: city.city.CityName,
        y: parseFloat(city.averageScore.toFixed(2)),
      })),
    },
  ];

  const options = {
    chart: {
      type: "heatmap" as const,
    },
    dataLabels: {
      enabled: true,
    },
    title: {
      text: " City Heatmap - Average Hotel Score",
    },
    xaxis: {
      title: { text: "City" },
    },
    yaxis: {
         title: { text: "Global Rate Hotels" },
    
    },
    colors: ["#008FFB"],
  };

  return (
    <div>
      <Header title="Heatmap Dashboard" />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Heatmap: Top Hotels per City</h2>
        <Chart options={options} series={series} type="heatmap" height={350} />
      </div>
    </div>
  );
};

