"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/product-categories");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    console.error("Categories error:", error);

    return (
      <div className="p-8">
        <p className="text-red-500">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>

        <Link
          href="/categories/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Category
        </Link>
      </div>

      {!categories || categories.length === 0 ? (
        <div className="border rounded-lg p-6 text-gray-500">
          No categories found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="border-collapse border w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-gray-800">
                  ID
                </th>
                <th className="border p-3 text-left text-gray-800">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="border p-3">{category.id}</td>
                  <td className="border p-3">{category.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}