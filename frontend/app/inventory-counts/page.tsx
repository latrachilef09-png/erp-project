"use client";

import { useEffect, useState } from "react";
import { getInventoryCounts } from "@/lib/api";
import Link from "next/link";

export default function InventoryCountsPage() {

  const [counts, setCounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadCounts() {
      try {
        const data = await getInventoryCounts();
        setCounts(data);
      } catch(error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCounts();

  }, []);


  if(loading){
    return <div>Loading...</div>;
  }


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Inventory Counts
      </h1>


      {counts.length === 0 ? (

        <p>
          No inventory counts found.
        </p>

      ) : (

        <div className="space-y-3">

          {counts.map((count)=>(
            <div
              key={count.id}
              className="border rounded p-4"
            >

              <p>
                ID: {count.id}
              </p>

              <p>
                Status: {count.status}
              </p>

              <p>
                Warehouse: {count.warehouse?.name}
              </p>

              <Link
  href={`/inventory-counts/${count.id}`}
  className="text-blue-600"
>
  Open
</Link>

            </div>
          ))}

        </div>

      )}

    </div>
  );
}