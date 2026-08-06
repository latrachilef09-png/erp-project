"use client";

import { useState } from "react";
import { createInventoryCount } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function InventoryCountForm() {

  const router = useRouter();

  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [countedQty, setCountedQty] = useState("");

  const [lines, setLines] = useState<any[]>([]);


  function addLine() {

    setLines([
      ...lines,
      {
        productId: Number(productId),
        countedQty: Number(countedQty),
      },
    ]);

    setProductId("");
    setCountedQty("");
  }


  async function submit() {

    await createInventoryCount({
      warehouseId: Number(warehouseId),
      lines,
    });

    router.push("/inventory-counts");
  }


  return (
    <div className="space-y-4">

      <h2 className="text-xl font-bold">
        Create Inventory Count
      </h2>


      <input
        className="border p-2"
        placeholder="Warehouse ID"
        value={warehouseId}
        onChange={(e)=>setWarehouseId(e.target.value)}
      />


      <div className="flex gap-2">

        <input
          className="border p-2"
          placeholder="Product ID"
          value={productId}
          onChange={(e)=>setProductId(e.target.value)}
        />


        <input
          className="border p-2"
          placeholder="Counted Quantity"
          value={countedQty}
          onChange={(e)=>setCountedQty(e.target.value)}
        />


        <button
          className="border px-3"
          onClick={addLine}
        >
          Add
        </button>

      </div>


      <div>
        {lines.map((line,index)=>(
          <p key={index}>
            Product {line.productId} : {line.countedQty}
          </p>
        ))}
      </div>


      <button
        className="bg-black text-white px-4 py-2"
        onClick={submit}
      >
        Create Count
      </button>


    </div>
  );
}