"use client";

import { useState } from "react";
import { updateCountLine } from "@/lib/api";

export default function InventoryCountLines({
  lines,
  refresh,
}: {
  lines: any[];
  refresh: () => void;
}) {

  return (
    <div className="space-y-4">

      {lines.map((line) => (
        <LineItem
          key={line.id}
          line={line}
          refresh={refresh}
        />
      ))}

    </div>
  );
}


function LineItem({
  line,
  refresh,
}: {
  line: any;
  refresh: () => void;
}) {

  const [qty, setQty] = useState(
    line.countedQty ?? ""
  );

  const [justification, setJustification] =
    useState("");


  async function save() {

    await updateCountLine(
      line.id,
      {
        countedQty: Number(qty),
        justification,
      }
    );

    refresh();
  }


  return (
    <div className="border rounded p-4">

      <p>
        Product: {line.product?.name}
      </p>

      <p>
        Expected: {line.expectedQty}
      </p>


      <input
        className="border p-2 mt-2"
        value={qty}
        onChange={(e)=>setQty(e.target.value)}
        placeholder="Counted quantity"
      />


      <input
        className="border p-2 mt-2 ml-2"
        value={justification}
        onChange={(e)=>setJustification(e.target.value)}
        placeholder="Justification"
      />


      <button
        className="border px-3 py-2 ml-2"
        onClick={save}
      >
        Save
      </button>


    </div>
  );
}