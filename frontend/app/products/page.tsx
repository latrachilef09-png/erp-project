"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";

interface Product {
  id: number;
  reference: string;
  name: string;
  minStock: number;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<ProductsResponse>({
    queryKey: ["products", page, search],
    queryFn: () =>
      productsService.getAll({
        page,
        limit: 10,
        search,
      }),
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    console.error("Products error:", error);

    return (
      <div className="p-8">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  const products = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>

        <a
          href="/products/create"
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Create Product
        </a>
      </div>

      <input
        className="mb-5 block w-full max-w-md rounded border p-2"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-gray-900">
            <th className="border p-3 text-left">Reference</th>
            <th className="border p-3 text-left">Name</th>
            <th className="border p-3 text-left">Min Stock</th>
            <th className="border p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="border p-5 text-center text-gray-500"
              >
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td className="border p-3">{product.reference}</td>
                <td className="border p-3">{product.name}</td>
                <td className="border p-3">{product.minStock}</td>

                <td className="border p-3">
                  <button
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    onClick={async () => {
                      const confirmed = window.confirm(
                        `Are you sure you want to delete "${product.name}"?`
                      );

                      if (!confirmed) return;

                      try {
                        await productsService.remove(product.id);
                        window.location.reload();
                      } catch (error) {
                        console.error("Delete product error:", error);
                        alert("Failed to delete product.");
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-5 flex items-center gap-4">
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}