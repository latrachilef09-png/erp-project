"use client"; import { useQuery } from "@tanstack/react-query"; import api from "@/lib/api"; interface Warehouse { id: number; name: string; code?: string; type?: string; } export default function WarehousesPage() { const { data: warehouses, isLoading, error, } = useQuery<Warehouse[]>({ queryKey: ["warehouses"], queryFn: async () => { const response = await api.get("/warehouses"); return response.data; }, }); if (isLoading) { return ( <div className="p-8"> <p className="text-gray-500">Loading warehouses...</p> </div> ); } if (error) { return ( <div className="p-8"> <p className="text-red-500"> Failed to load warehouses </p> </div> ); } return ( <div className="p-8"> <h1 className="text-3xl font-bold mb-6"> Warehouses </h1> {!warehouses || warehouses.length === 0 ? ( <div className="border rounded-lg p-6 text-gray-500"> No warehouses found </div> ) : ( <table className="border w-full"> <thead>
  <tr className="bg-gray-200 text-gray-900">
    <th className="border p-3 text-left font-semibold text-gray-900">
      ID
    </th>
    <th className="border p-3 text-left font-semibold text-gray-900">
      Name
    </th>
    <th className="border p-3 text-left font-semibold text-gray-900">
      Code
    </th>
    <th className="border p-3 text-left font-semibold text-gray-900">
      Type
    </th>
  </tr>
</thead> <tbody> {warehouses.map((warehouse) => ( <tr key={warehouse.id}> <td className="border p-3"> {warehouse.id} </td> <td className="border p-3"> {warehouse.name} </td> <td className="border p-3"> {warehouse.code || "-"} </td> <td className="border p-3"> {warehouse.type || "-"} </td> </tr> ))} </tbody> </table> )} </div> ); }