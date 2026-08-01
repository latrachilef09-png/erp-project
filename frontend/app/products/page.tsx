"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";


export default function ProductsPage() {

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);


  const { data, isLoading } = useQuery({

    queryKey: ["products", page, search],

    queryFn: () =>
      productsService.getAll({
        page,
        limit: 10,
        search,
      }),

  });


  if (isLoading)
    return <p>Loading...</p>;


  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold mb-5">
        Products
      </h1>

      <a
 href="/products/create"
 className="bg-green-600 text-white px-4 py-2 rounded"
>
 Create Product
</a>
      <input

        className="border p-2 mb-5"

        placeholder="Search product..."

        value={search}

        onChange={(e)=> {
          setSearch(e.target.value);
          setPage(1);
        }}

      />


      <table className="border w-full">

        <thead>

          <tr>

            <th className="border p-2">
              Reference
            </th>

            <th className="border p-2">
              Name
            </th>

            <th className="border p-2">
              Min Stock
            </th>

          </tr>

        </thead>


        <tbody>

        {data?.map((product:any)=>(

          <tr key={product.id}>

            <td className="border p-2">
              {product.reference}
            </td>

            <td className="border p-2">
              {product.name}
            </td>

            <td className="border p-2">
              {product.minStock}
            </td>

          </tr>

        ))}


        </tbody>

      </table>


      <div className="mt-5">

        <button

          className="border px-3 py-1"

          disabled={page===1}

          onClick={()=>setPage(page-1)}

        >
          Previous

        </button>


        <span className="mx-4">
          Page {page}
        </span>


        <button

          className="border px-3 py-1"

          onClick={()=>setPage(page+1)}

        >
          Next

        </button>


      </div>


    </div>

  );

}