"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  getInventoryCount,
  validateInventoryCount,
} from "@/lib/api";

import InventoryCountLines from "@/components/inventory-counts/InventoryCountLines";
import DiscrepancyReport from "@/components/inventory-counts/DiscrepancyReport";


export default function InventoryCountDetailsPage() {

  const params = useParams();

  const [count, setCount] = useState<any>(null);
  const [role, setRole] = useState("");


  async function load() {

  const data = await getInventoryCount(
    Number(params.id)
  );

  console.log(
  "INVENTORY COUNT JSON:",
  JSON.stringify(data, null, 2)
);

  setCount(data);
}


  async function validate() {

    await validateInventoryCount(
      Number(params.id)
    );

    load();

  }


  useEffect(() => {

    const token = localStorage.getItem("token");

if (token) {
  const decoded: any = jwtDecode(token);
  setRole(decoded.role);
}

    load();

  }, [params.id]);


  if (!count) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }


  return (

    <div className="p-6 space-y-5">


      <h1 className="text-2xl font-bold">
        Inventory Count #{count.id}
      </h1>


      <p>
        Status: {count.status}
      </p>


      <p>
        Warehouse: {count.warehouse?.name}
      </p>


      {(role === "ADMIN" || role === "STOCK_MANAGER") 
      && count.status !== "VALIDATED" && (

        <button
          className="border px-4 py-2 rounded"
          onClick={validate}
        >
          Validate Count
        </button>

      )}


      <h2 className="text-xl font-bold">
        Count Lines
      </h2>


      <InventoryCountLines
        lines={count.lines}
        refresh={load}
      />


      <DiscrepancyReport
        lines={count.lines}
      />


    </div>

  );

}