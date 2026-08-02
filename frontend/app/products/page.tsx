"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { productsService } from "@/services/products";

export default function ProductsPage() {

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState("name");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const {
    data,
    isLoading,
    error,
  } = useQuery({

    queryKey: [
      "products",
      page,
      search,
      sortBy,
      sortOrder,
    ],

    queryFn: () =>
      productsService.getAll({
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder,
      }),

  });


  const handleSort = (field: string) => {

    if (sortBy === field) {

      setSortOrder(
        sortOrder === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortBy(field);
      setSortOrder("asc");

    }

  };


  if (isLoading)
    return (
      <p className="p-8">
        Loading products...
      </p>
    );


  if (error)
    return (
      <p className="p-8 text-red-500">
        Failed to load products
      </p>
    );


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

        className="border p-2 my-5 block"

        placeholder="Search product..."

        value={search}

        onChange={(e)=>{

          setSearch(e.target.value);

          setPage(1);

        }}

      />


      <table className="border w-full">


        <thead>


          <tr>


            <th
              className="border p-2 cursor-pointer"
              onClick={()=>handleSort("reference")}
            >
              Reference
            </th>


            <th
              className="border p-2 cursor-pointer"
              onClick={()=>handleSort("name")}
            >
              Name
            </th>


            <th
              className="border p-2 cursor-pointer"
              onClick={()=>handleSort("minStock")}
            >
              Min Stock
            </th>


          </tr>


        </thead>



        <tbody>


        {
          data && data.length === 0 ? (

            <tr>

              <td
                colSpan={3}
                className="text-center p-5 text-gray-500"
              >
                No products found
              </td>

            </tr>


          ) : (


            data?.map((product:any)=>(

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

            ))


          )

        }


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