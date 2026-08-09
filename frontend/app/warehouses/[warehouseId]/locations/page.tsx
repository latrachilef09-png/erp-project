"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Location {
  id: number;
  code: string;
  name: string;
  description?: string;
  warehouseId: number;
}

export default function LocationsPage() {
  const params = useParams();
  const warehouseId = params.warehouseId;

  const {
    data: locations,
    isLoading,
    error,
  } = useQuery<Location[]>({
    queryKey: ["locations", warehouseId],
    queryFn: async () => {
      const response = await api.get(
        `/warehouses/${warehouseId}/locations`
      );

      return response.data;
    },
    enabled: !!warehouseId,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">
          Failed to load locations
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Warehouse Locations
      </h1>

      {!locations || locations.length === 0 ? (
        <div className="border rounded-lg p-6 text-gray-500">
          No locations found
        </div>
      ) : (
        <table className="border w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Code</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">
                Description
              </th>
            </tr>
          </thead>

          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="border p-3">
                  {location.id}
                </td>

                <td className="border p-3">
                  {location.code}
                </td>

                <td className="border p-3">
                  {location.name}
                </td>

                <td className="border p-3">
                  {location.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}