"use client";

export default function DiscrepancyReport({
  lines,
}: {
  lines: any[];
}) {

  return (
    <div className="border rounded p-4">

      <h2 className="text-xl font-bold mb-3">
        Discrepancy Report
      </h2>


      {lines.map((line) => (

        <div
          key={line.id}
          className="border-b py-2"
        >

          <p>
            Product: {line.product?.name}
          </p>


          <p>
            System Quantity: {line.systemQty}
          </p>


          <p>
            Counted Quantity: {line.countedQty}
          </p>


          <p>
            Difference: {line.discrepancy}
          </p>


          {line.justification && (
            <p>
              Justification: {line.justification}
            </p>
          )}

        </div>

      ))}

    </div>
  );
}